export const types = {
  CLEAR: "CLEAR",
  PREVIEW: "PREVIEW",
  SELECT: "SELECT"
};

export const statuses = {
  PLAIN: "PLAIN",
  PREVIEWED: "PREVIEWED",
  SELECTED: "SELECTED"
};

const isMouseHit = (mouseX, mouseY, x, y, size) => ((mouseX - x)**2)/(size*size/4) +((mouseY - y)**2)/(size*size/4) < 1;

const inititalState = {
  status: statuses.PLAIN,
  position: {
    mouseX: 0,
    mouseY: 0,
    x: 0,
    y: 0,
    size: 0
  },
  data: {
    "z": [],
    "z_2d": [],
    "filename": "",
    "img_size": 0
  }
};

export default function reducer(type, entity) {
  switch (type) {
    case types.CLEAR:
      return displayPlainEntity(entity);
    case types.PREVIEW:
      return previewEntity(entity);
    case types.SELECT:
      return selectEntity(entity);
    default:
      return displayPlainEntity(entity);
  }
}

function displayPlainEntity(entity) {
  entity.display();
  entity.status = statuses.PLAIN;
  return null;
}

function previewEntity(entity) {
  let isActive = isMouseHit(entity.mouseX, entity.mouseY, entity.x, entity.y, entity.size);
  if (!isActive) {
    return null;
  }
  entity.displayPreview();
  entity.status = statuses.PREVIEWED;
  return {
    status: entity.status,
    position: entity.position,
    data: entity.data
  };
}

function selectEntity(entity) {
  let isActive = isMouseHit(entity.mouseX, entity.mouseY, entity.x, entity.y, entity.size);
  if (!isActive) {
    return null;
  }
  entity.displaySelected();
  entity.status = statuses.SELECTED;
  return {
    status: entity.status,
    position: entity.position,
    data: entity.data
  };
}
