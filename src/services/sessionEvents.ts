type UnauthorizedHandler = () => void | Promise<void>;

let unauthorizedHandler: UnauthorizedHandler | null = null;
let handlingUnauthorized = false;

export const setUnauthorizedHandler = (handler: UnauthorizedHandler | null) => {
  unauthorizedHandler = handler;
};

export const emitUnauthorized = () => {
  if (!unauthorizedHandler || handlingUnauthorized) {
    return;
  }

  handlingUnauthorized = true;
  Promise.resolve(unauthorizedHandler())
    .catch(() => undefined)
    .finally(() => {
      handlingUnauthorized = false;
    });
};
