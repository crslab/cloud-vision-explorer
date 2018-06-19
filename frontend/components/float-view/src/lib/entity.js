import { statuses } from "./entityActions.js";
import CustomEventsCollection from "../common/customEvents.js";

class Entity {
  constructor(imgPathPrefix,
              p,
              data,
              w = 20,
              h = 20,
              data_min_x = -35,
              data_min_y = -43,
              data_range_x = 70,
              data_range_y = 86,
              selected_border_width = 3) {
    this.status = statuses.PLAIN;
    this.imgPathPrefix = imgPathPrefix;
    this.p = p;
    this.data = data;
    this.w = w;
    this.h = h;
    this.data_min_x = data_min_x;
    this.data_min_y = data_min_y;
    this.data_range_x = data_range_x;
    this.data_range_y = data_range_y;
    this.embed = this.data.z;
    this.selected_border_width = selected_border_width;
    this.absW = this.p.width;
    this.absH = this.p.height;
    this.size = data.img_size;
    this.wRadius = this.w / 2;
    this.hRadius = this.h / 2;
    this.wCorner = this.absW - this.wRadius;
    this.hCorner = this.absH - this.hRadius;
    let xOffset = this.absW * (data.z_2d[0] - this.data_min_x)/this.data_range_x;
    let yOffset = this.absH * (data.z_2d[1] - this.data_min_y)/this.data_range_y;
    this.x = (xOffset < this.wRadius) ? this.wRadius : ((xOffset > this.wCorner) ? this.wCorner : xOffset);
    this.y = (yOffset < this.hRadius) ? this.hRadius : ((yOffset > this.hCorner) ? this.hCorner : yOffset);
  }

  get mouseX() {
    return this.p.mouseX;
  }

  get mouseY() {
    return this.p.mouseY;
  }

  get position() {
    return {
      mouseX: this.mouseX,
      mouseY: this.mouseY,
      x: this.x,
      y: this.y,
      size: this.size
    };
  }

  display() {
    this.p.loadImage(this.imgPathPrefix + this.data.filename, img => {
        this.p.image(img, this.x - this.size/2, this.y - this.size/2);
    });
  }

  displayPreview() {
    console.log("\nPreviewing image to be implemented\n");
  }

  displaySelected() {
    this.p.noStroke();
    this.p.fill(128,240,128);
    this.p.rect(this.x-this.size/2-this.selected_border_width, this.y-this.size/2-this.selected_border_width, this.size+2*this.selected_border_width, this.size+2*this.selected_border_width);
    this.p.loadImage(this.imgPathPrefix + this.data.filename, img => {
        this.p.image(img, this.x - this.size/2, this.y - this.size/2);
    });
  }
}

export default Entity;
