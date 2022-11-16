import { Incident } from "../types/incident-object.ts";

const getConfluenceCreateHTML = (incident: Incident) => {
  const html = `
<p>This is <br/> new incident</p>
`;
  return html;
};

export { getConfluenceCreateHTML };
