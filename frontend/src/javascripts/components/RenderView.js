import React, { Component } from 'react'
import PropTypes from 'prop-types';
import * as THREE from 'three'
import TWEEN    from 'tween.js'
import _        from 'lodash'
import Shaders  from '../misc/Shaders.js'
import Random   from 'random-js'
import { Button } from 'react-toolbox/lib/button';
import { getSourceImageUrl, getInterpolatedImageUrl } from 'javascripts/api/api.js'
import dse from 'javascripts/misc/dynamicSliderEvents.js';
import ce from 'javascripts/misc/clickEvents.js';
import ClickState, { stages } from 'javascripts/misc/clickState.js';

import { getVisionJsonURL,
         preloadImage }               from '../misc/Util.js'
import { createHexagonSpriteFromUrl,
         createTextSprite,
         groupOpacFunction,
         updateNodeColor  }           from '../misc/RenderUtil.js'
import { gcsBucketName,
         gcsDatapointPath }           from '../config.js'

// Load some webpack-incompatible modules
import FreeLookControls from '../misc/FreeLookControls.js';
FreeLookControls(THREE)

// Styles
import 'stylesheets/RenderView'

const seededRandom = new Random(Random.engines.mt19937().seed(0))

const DATAPOINT_URL = `https://storage.googleapis.com/${gcsBucketName}/${gcsDatapointPath}`

const tweenSpeed = 200
const thumbCheckSpeed = 10

// denseFactor determines how big our 3D universe is.
// Every coordinate/setting is scaled by this factor
const denseFactor = 1000.0

let currentlyTrackingNode = null
let currentlyZoomedCluster = null

// When we request an animation, attach it to a promise
// so it runs after whatever we're doing now
let cameraAnimationQueue = Promise.resolve()

// Promise version of TWEEN.js
const tween = (start, end, duration, onUpdateFn, easingFn = TWEEN.Easing.Quadratic.InOut) => {
  return new Promise((resolve) => {
    new TWEEN.Tween(start)
      .to(end, duration)
      .start()
      .easing(easingFn)
      .onUpdate(onUpdateFn) // Can't use arrow functions here as 'this' would be undefined
      .onComplete(resolve)
  })
}

// Simple promise version of setTimeout()
const wait = (time) => new Promise((resolve) => setTimeout(resolve, time))

const textureLoader = new THREE.TextureLoader()

const style = {
  resetButton: {
    width: 300,
    height: 140,
    backgroundColor: 'red',
    fontWeight: 'bold',
    fontSize: 90,
    top: '4vh',
    left: '3.5vh'

  }
}

class RenderView extends Component{
  constructor(props) {
    super(props)
    this.clickState = new ClickState()
  }

  render() {
    return (
      <div id="render-view__container">
        <div id="render-view__slider-overlay">
          <Button id="render-view__reset-btn" style={style.resetButton} label="Reset" raised accent />
          {this.props.state.interpolate.isShowSlider &&
            <dynamic-slider id="render-view__slider"
                            line-color="white"
                            handle-color="pink"
                            line-thickness="30"
                            handle-radius="60"
                            x1={this.props.state.interpolate.pt1.x}
                            y1={this.props.state.interpolate.pt1.y}
                            x2={this.props.state.interpolate.pt2.x}
                            y2={this.props.state.interpolate.pt2.y}></dynamic-slider>
          }

        </div>
        <div ref={(c) => this._container = c} className="render-view"></div>
      </div>
    )
  }

  componentDidMount() {
    document.getElementById("render-view__reset-btn").addEventListener("click", e => {
      this.clickState.clean(
        this.props.action.interpolate.reset
      )
      this.props.emitter.emit('reset')
    })
    this.props.emitter.addListener(ce.preview, (id, openSideBar) => {
      if (!this.props.state.interpolate.isShowSlider && !this.props.state.interpolate.isSliderNodesReady){
        this.clickState.preview()
        this.props.emitter.emit('zoomToImage', id, true)
        let data = this.props.state.interpolate.getDataFromId(id)
        this.props.emitter.emit('sidebar-data-ready', getSourceImageUrl(data.filename), data.rating)
      }
    })
    this.props.emitter.addListener(ce.select, (id, openSideBar) => {
      if (!this.props.state.interpolate.isCanSelect(id)) {
        return;
      }
      if ((this.clickState.stage === stages.SELECTED_1ST) || (this.clickState.stage === stages.CLEAN) || (this.clickState.stage === stages.PREVIEWED)){
        this.props.emitter.emit('selectedImg', id)
      }
      this.clickState.select(
        this.props.action.interpolate.addStart,
        this.props.action.interpolate.addEnd,
        [id]
      )
    })
    this.props.emitter.addListener("interpolate-focus-ready", positionData => {
      // Mitigate trackTwoNodees' nested promise's delayed event emitting.
      if (this.clickState.stage === stages.SELECTED_2ND) {
        this.clickState.displaySlider(
          this.props.action.interpolate.pinPositions,
          [positionData.v1, positionData.v2]
        )
      }
    })
    this.props.emitter.addListener('interpolate-images-ready', () => {
        this.props.action.interpolate.notifyImagesReady()
    })
    fetch(DATAPOINT_URL).then((res) => {
      return res.json()
    }).then((data) => {
      this._setupScene(data)
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.clickState.stage === stages.SELECTED_2ND) {
      this.props.emitter.emit('interpolate-nodes-ready', this.props.state.interpolate.pt1.imgId, this.props.state.interpolate.pt2.imgId, true)
    }
    if (this.props.state.interpolate.isShowSlider) {
      document.getElementById("render-view__slider").addEventListener(dse.sliderStart, e => {
        this.clickState.startSlider()
      })
      document.getElementById("render-view__slider").addEventListener(dse.sliderMove, e => {
        this.clickState.interpolate(
          this.props.action.interpolate.async.interpolate,
          [e.detail.proportion]
        )
      })
      document.getElementById("render-view__slider").addEventListener(dse.sliderStop, e => {
        this.clickState.stopSlider()
      })
    }
    if (this.props.state.interpolate.isDataReady) {
      this.props.emitter.emit('sidebar-data-ready', this.props.state.interpolate.result.resultUrl, this.props.state.interpolate.histogram.val)
    }
  }

  _setupScene({points, clusters}) {

    this.props.emitter.emit('imageCount', points.length)

    const camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 1, denseFactor * 10)
    camera.position.z = denseFactor * 0.6

    const scene = new THREE.Scene()

    const raycaster = new THREE.Raycaster()

    // Increase the default mouseover detection radius of points
    raycaster.params.Points.threshold = denseFactor / 100 // was 1000

    // Used for mousepicking
    const mouse = new THREE.Vector2()

    const lookAtTarget = new THREE.Vector3()
    const cameraTargetPosition = camera.position.clone()

    // Do some post-processing for points
    points.forEach((n, i) => {
      // Add a real THREE vector for easy access later
      n.vec = new THREE.Vector3(n.x, n.y, n.z)

      // Cleanup
      delete n.x
      delete n.y
      delete n.z

      // Normalize it
      n.vec.multiplyScalar(denseFactor)

      // Add a real THREE color
      n.color = new THREE.Color()

      // Add the index too for easy post-processing
      n.index = i

      // Add a resolved promised so we can chain events to it
      n._promise = Promise.resolve()

      // If there are points without an existing cluster
      // create one for them
      if (!clusters[n.g]) {
        clusters[n.g] = {
          x: 0,
          y: 0,
          z: 0,
          label: ''
        }
      }
    })

    // Monkey-patch the dataset for the demo
    points.forEach((p) => {
      // There's an ugly cat in the way of the first node, move it to the back
      if (p.i === '9881051092d70afabf5e3fdab465547a') {
        p.vec.add(new THREE.Vector3(10, 0, 0))
      }
    })

    // Do some post-processing for clusters
    clusters.forEach((cluster) => {
      // Add a real THREE vector for easy access later
      cluster.center = new THREE.Vector3(cluster.x, cluster.y, cluster.z)
      cluster.center.multiplyScalar(denseFactor)

      // Cleanup
      delete cluster.x
      delete cluster.y
      delete cluster.z
    })

    {
      // First sort by the group ID ascending
      const sortedData = _.orderBy(points, ['g'], ['asc'])

      // Generate an object consisting out of groups of cluster IDs
      const groupedData = _.groupBy(sortedData, (element) => element.g)

      // Add metadata to each group
      _.each(groupedData, (value, key) => {
        const intKey = parseInt(key)

        // Access all points for this cluster easily
        clusters[intKey].points = value

        // Assign a random color to this cluster
        clusters[intKey].color = new THREE.Color(0xffffff * seededRandom.real(0.0, 1.0))
      })
    }

    const positions = new Float32Array(points.length * 3)
    const colors = new Float32Array(points.length * 3)
    const sizes = new Float32Array(points.length)

    const PARTICLE_SIZE = denseFactor / 100

    const group = new THREE.Group()

    for (let i = 0, l = points.length; i < l; i++) {

      const vertex = points[ i ].vec
      vertex.toArray(positions, i * 3)

      points[i].color.set(clusters[points[i].g].color)
      points[i].color.toArray(colors, i * 3)

      sizes[i] = PARTICLE_SIZE
    }

    const geometry = new THREE.BufferGeometry()
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.addAttribute('customColor', new THREE.BufferAttribute(colors, 3))
    geometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const material = new THREE.ShaderMaterial({
      uniforms: {
        color:   { type: 'c', value: new THREE.Color( 0xffffff ) },
        texture: { type: 't', value: textureLoader.load( 'images/disc.png' ) }
      },
      vertexShader: Shaders.points.vertexShader,
      fragmentShader: Shaders.points.fragmentShader,
      alphaTest: 0.5,
      transparent: true,
      depthTest: false
    })

    const particles = new THREE.Points(geometry, material)
    group.add(particles)

    // To achieve an effect similar to the mocks, we need to shoot a line
    // at another node that is most near, except if node that was already drawn to
    _.forEach(clusters, (value, key) => {
      const geometry = new THREE.Geometry()

      const lineMaterial = new THREE.LineBasicMaterial({
        color: value.color,
        blending:     THREE.AdditiveBlending,
        depthTest:    false,
        transparent:  true,
        linewidth: 10,
        opacity: 0.3
      })

      const vertices = clusters[key].points.map((p) => p.vec)

      geometry.vertices = vertices

      const line = new THREE.Line( geometry, lineMaterial )

      value.lineMaterial = lineMaterial

      group.add(line)
    })

    // Add cluster names
    clusters.forEach((cluster) => {
      const sprite = createTextSprite(cluster.label)

      sprite.position.copy(cluster.center)
      sprite.scale.multiplyScalar(denseFactor / 2)

      cluster.sprite = sprite

      group.add(sprite)
    })

    scene.add(group)

    const controls = new THREE.FreeLookControls(camera, this._container)

    const trackNode = (node) => {

      // Reset lookAtTarget to (0,0,0) when only one image is selected
      lookAtTarget.set(0,0,0)
      const resetPos = new THREE.Vector3(0, 0, denseFactor * 0.6)

      const nodeGroup = clusters[((node || {}).g || 0)]

      // We only want to reset the panning, so still save the camera position
      // as that needs to lerp to its target instead
      const startPoint = camera.position.clone()

      const endPointUnit = ((node || {}).vec || resetPos).clone().normalize()
      const endPoint = ((node || {}).vec || resetPos).clone() //default for reset button
      if (node) { //if previewing a node, go back 20 units distance away
        endPoint.add(endPointUnit.clone().multiplyScalar(20))
      }

      const startPointNormalized = startPoint.clone().normalize()
      const endPointNormalized = endPoint.clone().normalize()
      const cross = endPointNormalized.clone().cross(startPointNormalized).normalize()

      const angle = startPoint.angleTo(endPoint)

      const startPointDistance = startPoint.length()
      const endPointDistance = endPoint.length()

      const zoomOutDistance = 2000

      let totalAnimTime = angle * 2000
      totalAnimTime = Math.max(totalAnimTime, 2000)

      const otherGroupsFadeInTime = 1000
      const groupFocusTime = 1000

      const waitTime = totalAnimTime - otherGroupsFadeInTime - groupFocusTime

      let resetTween = TWEEN.Easing.Exponential.InOut
      if (!node){ // make reset FAST
        totalAnimTime /= 2
      } else { // and let preview be linear.
        resetTween = TWEEN.Easing.Linear.None
      }

      return Promise.resolve()
      // Make other clusters look dark
      .then(() => {
        currentlyTrackingNode = node || true

        // Rotate around
        return Promise.all([
          Promise.resolve()
          .then(() => wait(waitTime/3))
          .then(() => {
            return (currentlyZoomedCluster !== null ? tween({
              f: 0.3
            }, {
              f: 1.0
            }, otherGroupsFadeInTime, groupOpacFunction(points, geometry, clusters, currentlyZoomedCluster)) : wait(otherGroupsFadeInTime))
          })
          .then(() => wait((waitTime/3)*0.5))
          .then(() => {
            return tween({
              f: 1.0
            }, {
              f: 0.3
            }, groupFocusTime, groupOpacFunction(points, geometry, clusters, nodeGroup))
          }),
          tween({
            f: 0
          }, {
            f: 1
          }, totalAnimTime, function () {

            const qF = TWEEN.Easing.Quadratic.InOut(this.f)
            const qD = startPointDistance + (endPointDistance - startPointDistance) * qF

            const interpolatedPosition = startPoint.clone().applyAxisAngle(cross, -angle * qF)

            let bouncingF = this.f
            if (bouncingF > 0.5) {
              bouncingF = TWEEN.Easing.Sinusoidal.InOut((1.0 - bouncingF) * 2)
            }
            else {
              bouncingF = TWEEN.Easing.Quadratic.InOut(this.f * 2)
            }

            const distance = qD + zoomOutDistance * bouncingF * angle * 0.2

            interpolatedPosition.normalize().multiplyScalar(distance)

            camera.position.copy(interpolatedPosition)
            cameraTargetPosition.copy(camera.position)
          }, resetTween)
        ])
      })
      .then(() => {
        currentlyZoomedCluster = nodeGroup
        currentlyTrackingNode = null

        return Promise.resolve()
      })
    }

    const trackTwoNodes = (node1,node2) => {

      const nodeGroup = clusters[node1.g]
      const startPoint = camera.position.clone()

      // Set up variables for looking at the midpoint of the line between two icons
      const lineDir  = node2.vec.clone().sub(node1.vec)
      const midPoint = node1.vec.clone().multiplyScalar(0.5).add(node2.vec.clone().multiplyScalar(0.5))
      const lineLen  = lineDir.length()

      // Camera is shifted from the midpoint in a direction perpendicular to the two nodes' position vectors
      const crossNodes = (node2.vec.clone().cross(node1.vec.clone())).normalize()
      const endPoint   = midPoint.clone().add(crossNodes.clone().multiplyScalar(lineLen/1.73)) // tan60 computation shortcut for now

      console.log("Node 1: "     + node1.vec.x, node1.vec.y, node1.vec.z)
      console.log("Node 2: "     + node2.vec.x, node2.vec.y, node2.vec.z)
      console.log("Midpoint: "   + midPoint.x, midPoint.y, midPoint.z)
      console.log("Crossnodes: " + crossNodes.x, crossNodes.y, crossNodes.z)
      console.log("Endpoint: "   + endPoint.x, endPoint.y, endPoint.z)
      console.log("Line len: "   + lineLen)

      const startPointNormalized = startPoint.clone().normalize()
      const endPointNormalized = endPoint.clone().normalize()
      const cross = endPointNormalized.clone().cross(startPointNormalized).normalize()

      const angle = startPoint.angleTo(endPoint)

      const startPointDistance = startPoint.length()
      const endPointDistance = endPoint.length()

      const zoomOutDistance = 2000

      let totalAnimTime = angle * 2000
      totalAnimTime = Math.max(totalAnimTime, 2000)

      const otherGroupsFadeInTime = 1000
      const groupFocusTime = 1000

      const waitTime = totalAnimTime - otherGroupsFadeInTime - groupFocusTime


      // trying to set the lookat vector to midpoint, but not sure:
      // - whether this code belongs here (lookat doesn't seem to get updated unless clicked twice)
      // - whether resetting lookAtTarget to (0,0,0) in trackNode is correct
      // - whether camera.up should be reset here as well
      lookAtTarget.copy(midPoint)

      return Promise.resolve()
      // Make other clusters look dark
      .then(() => {
        currentlyTrackingNode = node1

        // Rotate around
        return Promise.all([
          Promise.resolve()
          .then(() => wait(waitTime/3))
          .then(() => {
            return (currentlyZoomedCluster !== null ? tween({
              f: 0.3
            }, {
              f: 1.0
            }, otherGroupsFadeInTime, groupOpacFunction(points, geometry, clusters, currentlyZoomedCluster)) : wait(otherGroupsFadeInTime))
          })
          .then(() => wait((waitTime/3)*0.5))
          .then(() => {
            return tween({
              f: 1.0
            }, {
              f: 0.3
            }, groupFocusTime, groupOpacFunction(points, geometry, clusters, nodeGroup))
          }),
          tween({
            f: 0
          }, {
            f: 1
          }, totalAnimTime, function () {

            const qF = TWEEN.Easing.Quadratic.InOut(this.f)
            const qD = startPointDistance + (endPointDistance - startPointDistance) * qF

            const interpolatedPosition = startPoint.clone().applyAxisAngle(cross, -angle * qF)

            let bouncingF = this.f
            if (bouncingF > 0.5) {
              bouncingF = TWEEN.Easing.Sinusoidal.InOut((1.0 - bouncingF) * 2)
            }
            else {
              bouncingF = TWEEN.Easing.Quadratic.InOut(this.f * 2)
            }

            const distance = qD + zoomOutDistance * bouncingF * angle * 0.2

            interpolatedPosition.normalize().multiplyScalar(distance)

            camera.position.copy(interpolatedPosition)
            cameraTargetPosition.copy(camera.position)
          }, TWEEN.Easing.Exponential.Out),
        ])
      })
      .then(() => {
        currentlyZoomedCluster = nodeGroup
        currentlyTrackingNode = null
        console.log("SHOW COORDS")
        var canvasss = renderer.domElement.getBoundingClientRect();

        var vector1 = node1.vec.clone()
        // map to normalized device coordinate (NDC) space
        vector1.project( camera );

        // map to 2D screen space
        vector1.x = Math.round( (   vector1.x + 1 ) * canvasss.width  / 2 );
        vector1.y = Math.round( ( - vector1.y + 1 ) * canvasss.height / 2 ) - 30; //bias from some top bar.
        vector1.z = 0;

        var vector2 = node2.vec.clone()
        // map to normalized device coordinate (NDC) space
        vector2.project( camera );

        // map to 2D screen space
        vector2.x = Math.round( (   vector2.x + 1 ) * canvasss.width  / 2 );
        vector2.y = Math.round( ( - vector2.y + 1 ) * canvasss.height / 2 ) - 30;
        vector2.z = 0;

        let positionData = {
          v1: vector1,
          v2: vector2,
          node1name: node1.i,
          node2name: node2.i
        }
        return Promise.resolve(positionData)
      })
    }

    this.props.emitter.addListener('zoomToImage', (id, openSideBar) => {
      // Preload the image results JSON file so it'll show instantly
      // when the sidebar is opened
      preloadImage(getVisionJsonURL(id))

      cameraAnimationQueue = cameraAnimationQueue

        .then(() => {
            return trackNode(_.find(points, (p) => p.i === id))
        })
        .then(() => {
          if (openSideBar) {
            this.props.emitter.emit('showSidebar', id)
          }
        })
    })

    this.props.emitter.addListener('reset', () => {
      this.props.emitter.emit('wipeSelected')
      trackNode()
    })

    this.props.emitter.addListener('interpolate-nodes-ready', (n1, n2, openSideBar) => {
      // Preload the image results JSON file so it'll show instantly
      // when the sidebar is opened
      cameraAnimationQueue = cameraAnimationQueue
        .then(() => {
          let node1 = _.find(points, (p) => p.i === n1) //ppt1_001
          let node2 = _.find(points, (p) => p.i === n2) //ppt1_002
          return trackTwoNodes(node1, node2)
        })
        .then(positionData => {
          this.props.emitter.emit('interpolate-focus-ready', positionData)
          if (openSideBar) {
            this.props.emitter.emit('showSidebar', 'ppt1_001') // temp hardcode
          }
        })
    })


    const renderer = new THREE.WebGLRenderer()
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    this._container.appendChild(renderer.domElement)

    this._container.addEventListener( 'mousemove', (event) => {
      mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
      mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1
    }, false)

    const clock = new THREE.Clock()




    window.addEventListener('resize', () => {

      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()

      renderer.setSize(window.innerWidth, window.innerHeight)

    }, false)

    let lastClickedNodeIndex = null
    let lastIntersectIndex = null

    let currentListOfNearbyVectors = []

    const checkForImagesThatCanBeDownloaded = _.throttle(() => {
      // Keep track of particles that are within our range, and particles
      // that are outside our range. Add images for the ones that are near
      let listOfNearbyVectors = []

      if (!currentlyTrackingNode) {
        points.forEach((n) => {
          if ((!this.props.state.interpolate.isSliderNodesReady &&
               (n.vec.distanceToSquared(camera.position) < Math.pow(denseFactor * 0.50, 2))) ||
              (this.props.state.interpolate.isSliderNodesReady &&
               (n.i === this.props.state.interpolate.pt1.imgId || n.i === this.props.state.interpolate.pt2.imgId ))) {
            listOfNearbyVectors.push(n)
          }
        })
      }

      listOfNearbyVectors = _.uniq(listOfNearbyVectors)

      const listOfRemovedNearbyVectors = currentListOfNearbyVectors.filter((nearbyVector) => {
        return !_.includes(listOfNearbyVectors, nearbyVector)
      })

      listOfRemovedNearbyVectors.forEach((nearbyVector) => {
        nearbyVector._promise = nearbyVector._promise
        .then(() => {
          return tween({
            o: 1.0
          }, {
            o: 0.0
          }, tweenSpeed, function () {
            nearbyVector.plane.material.opacity = this.o
          })
        })
        .then(() => {

          nearbyVector.plane.material.map.dispose()
          nearbyVector.plane.material.dispose()

          group.remove(nearbyVector.plane)

          delete nearbyVector.plane

          return Promise.resolve()
        })
        .then(() => {
          return tween({
            r: 0,
            g: 0,
            b: 0
          }, {
            r: nearbyVector.color.r,
            g: nearbyVector.color.g,
            b: nearbyVector.color.b
          }, tweenSpeed, function () {
            updateNodeColor(geometry, this.r, this.g, this.b, nearbyVector.index)
          })
        })
      })

      const listOfNewNearbyVectors = listOfNearbyVectors.filter((nearbyVector) => {
        return !_.includes(currentListOfNearbyVectors, nearbyVector)
      })

      listOfNewNearbyVectors.forEach((nearbyVector) => {
        nearbyVector._promise = nearbyVector._promise
        .then(() => {
          return tween({
            r: nearbyVector.color.r,
            g: nearbyVector.color.g,
            b: nearbyVector.color.b
          }, {
            r: 0,
            g: 0,
            b: 0
          }, tweenSpeed, function () {
            updateNodeColor(geometry, this.r, this.g, this.b, nearbyVector.index)
          })
        })
      })

      // Only request thumbs if there are any vectors nearby at all
      if (listOfNewNearbyVectors.length) {
        listOfNewNearbyVectors.forEach((nearbyVector) => {
          nearbyVector._promise = nearbyVector._promise.then(() => {
            return createHexagonSpriteFromUrl(`https://storage.googleapis.com/${gcsBucketName}/thumbnail/128x128/${nearbyVector.i}.jpg`)
            .then((sprite) => {
              nearbyVector.plane = sprite
              nearbyVector.plane.position.copy(nearbyVector.vec)
              if (this.props.state.interpolate.isSliderNodesReady) {
                let node1 = _.find(points, (p) => p.i === this.props.state.interpolate.pt1.imgId)
                let node2 = _.find(points, (p) => p.i === this.props.state.interpolate.pt2.imgId)
                let lineLength = node2.vec.clone().sub(node1.vec).length()
                nearbyVector.plane.scale.multiplyScalar(denseFactor / 2000 * lineLength) // was 500
              } else {
                nearbyVector.plane.scale.multiplyScalar(denseFactor / 50) // was 500
              }
              group.add(nearbyVector.plane)
            })
            .then(() => {
              if (this.props.state.interpolate.isSliderNodesReady)
                this.props.emitter.emit('interpolate-images-ready')
            })
            .then(() => {
              return tween({
                o: 0
              }, {
                o: 1.0
              }, tweenSpeed, function () {
                nearbyVector.plane.material.opacity = this.o
              })
            })
          })
        })
      }

      currentListOfNearbyVectors = listOfNearbyVectors
    }, thumbCheckSpeed)

    let mousedownObject = null

    this._container.addEventListener( 'mousedown', () => {

      raycaster.setFromCamera( mouse, camera )
      const intersects = raycaster.intersectObject(particles)

      if ( intersects.length > 0 ) {
        mousedownObject = intersects[ 0 ].index
      }
      else {
        mousedownObject = null
      }
    }, false)

    this._container.addEventListener( 'mouseup', () => {
      raycaster.setFromCamera( mouse, camera )
      const intersects = raycaster.intersectObject(particles)

      if ( intersects.length > 0 && !controls.hasRecentlyRotated && !this.props.state.interpolate.isSliderNodesReady) {
        const index = intersects[ 0 ].index
        if ( mousedownObject === index ) {
          // Make sure the object has an actual image
          if (points[index].plane) {
            lastClickedNodeIndex = index
            this.props.emitter.emit('showSidebar', points[lastClickedNodeIndex].i)
          }
        }
      }
    }, false)

    this._container.addEventListener('mousewheel', () => {
      let delta = 0

      if ( event.wheelDelta ) {
        delta = event.wheelDelta / 40
      }
      else if ( event.detail ) {
        delta = - event.detail / 3
      }

      const forwardVec = new THREE.Vector3(0, 0, -1)
      forwardVec.applyQuaternion(camera.quaternion)
      forwardVec.multiplyScalar(delta)

      cameraTargetPosition.add(forwardVec)
    })

    const m1 = new THREE.Matrix4()

    const tick = (delta) => {

      if (!currentlyTrackingNode) {
        controls.enabled = true
        controls.update(delta)
        camera.position.lerp(cameraTargetPosition, delta * 4)
      }
      else {
        controls.enabled = false
        m1.lookAt(camera.position, lookAtTarget, camera.up)
        const targetQuat = new THREE.Quaternion()
        targetQuat.setFromRotationMatrix(m1)
        camera.quaternion.slerp(targetQuat, delta * 2)
      }

      raycaster.setFromCamera( mouse, camera )

      const intersects = raycaster.intersectObject(particles)

      // If our mouse hovers over something
      if ( intersects.length > 0 ) {
        // If the object we're hovering over is different from what we last hovered over
        if ( lastIntersectIndex != intersects[0].index ) {
          const node = points[intersects[0].index]
          if (node.plane) {
            node.plane.material.color.copy(new THREE.Color(0xffffff))
          }

          // If we have hovered over something before
          if (lastIntersectIndex) {
            const oldNode = points[lastIntersectIndex]
            if (oldNode.plane) {
              oldNode.plane.material.color.copy(new THREE.Color(0xcccccc))
            }
          }
          lastIntersectIndex = intersects[ 0 ].index
        }
      }
      // If we're not hovering over something
      else {
        // If we were hovering over an object before
        if ( lastIntersectIndex !== null ) {
          const oldNode = points[lastIntersectIndex]
          if (oldNode.plane) {
            oldNode.plane.material.color.copy(new THREE.Color(0xcccccc))
          }

          lastIntersectIndex = null
        }
      }

      checkForImagesThatCanBeDownloaded()

      if (!currentlyTrackingNode && !currentlyZoomedCluster) {
        clusters.forEach((c) => {
          let opac = c.center.distanceTo(camera.position) / 1000
          opac = Math.max(opac, 0.3)
          opac = Math.min(opac, 1.0)
          c.sprite.material.opacity = opac
        })
      }

      // When zooming out, clear the focused cluster and show back all groups
      if (camera.position.lengthSq() > 1000 * 1000
        && currentlyZoomedCluster
        && !currentlyTrackingNode) {
        const oldZoomedCluster = currentlyZoomedCluster
        currentlyZoomedCluster = null

        cameraAnimationQueue = cameraAnimationQueue.then(() => {
          return tween({
            f: 0.3
          }, {
            f: 1.0
          }, 1000, groupOpacFunction(points, geometry, clusters, oldZoomedCluster))
        })
      }

    }

    const animate = () => {
      const delta = clock.getDelta()

      requestAnimationFrame(animate)

      TWEEN.update()

      tick(delta)

      renderer.render(scene, camera)
    }

    animate()
  }
}

RenderView.propTypes = {
  emitter: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired,
  action: PropTypes.object.isRequired
}

export default RenderView
