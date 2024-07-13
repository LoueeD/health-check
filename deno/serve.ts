import { type StatusPageConfig, createStatusPage } from "../mod.ts";

const staticConfig: StatusPageConfig = {
  title: "My Company Status",
  logo: `<svg width="43" height="22" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="transparent"/>
  <text x="50%" y="50%" font-size="18" fill="#333" text-anchor="middle" alignment-baseline="middle">Logo</text>
</svg>`,
  currentStatus: "noissue",
  environments: [
    {
      name: "Production",
      services: [
        { name: "Web App", status: "noissue" },
        { name: "API", status: "incident" },
        { name: "Database", status: "noissue" },
      ],
    },
    {
      name: "Staging",
      services: [
        { name: "Web App", status: "noissue" },
        { name: "API", status: "noissue" },
        { name: "Database", status: "outage" },
      ],
    },
  ],
  customCSS: '',
};

Deno.serve(() => createStatusPage(staticConfig));