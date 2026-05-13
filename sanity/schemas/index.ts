import { portableText } from "./blocks/portableText";
import { inquiry } from "./inquiry";
import { insightPost } from "./insightPost";
import { project } from "./project";
import { siteSettings } from "./siteSettings";
import { studioPage } from "./studioPage";

export const schemaTypes = [
  // documents
  project,
  insightPost,
  studioPage,
  siteSettings,
  inquiry,
  // shared
  portableText,
];
