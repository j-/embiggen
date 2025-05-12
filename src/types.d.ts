// https://github.com/microsoft/TypeScript-DOM-lib-generator/issues/1615
type OrientationLockType = "any" | "landscape" | "landscape-primary" | "landscape-secondary" | "natural" | "portrait" | "portrait-primary" | "portrait-secondary";
interface ScreenOrientation extends EventTarget {
  lock(orientation: OrientationLockType): Promise<void>;
}
