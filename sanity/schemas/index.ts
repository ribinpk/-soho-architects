import { portableText } from "./blocks/portableText";
import { inquiry } from "./inquiry";
import { project } from "./project";
import { siteSettings } from "./siteSettings";
import { studioPage } from "./studioPage";

export const schemaTypes = [
  // documents
  project,
  studioPage,
  siteSettings,
  inquiry,
  // shared
  portableText,
];
