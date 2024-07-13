export const Status = {
  noissue: 'noissue',
  incident: 'incident',
  outage: 'outage',
} as const;

/**
 * Represents the possible status types for services and the overall system.
 * @typedef {typeof Status[keyof typeof Status]} StatusType
 */
export type StatusType = typeof Status[keyof typeof Status];

/**
 * Represents status information including an icon and title.
 * @interface StatusInfo
 * @property {string} icon - The SVG icon representing the status.
 * @property {string} title - The title describing the status.
 */
export interface StatusInfo {
  icon: string;
  title: string;
}

/**
 * Represents a service with a name and status.
 * @interface Service
 * @property {string} name - The name of the service.
 * @property {StatusType} status - The current status of the service.
 */
export interface Service {
  name: string;
  status: StatusType;
}

/**
 * Represents an environment containing multiple services.
 * @interface Environment
 * @property {string} name - The name of the environment.
 * @property {Service[]} services - An array of services within the environment.
 */
export interface Environment {
  name: string;
  services: Service[];
}

/**
 * Configuration options for creating a status page.
 * @interface StatusPageConfig
 * @property {string} title - The title of the status page.
 * @property {string} logo - URL or SVG string of the logo to display.
 * @property {StatusType} currentStatus - The overall current status.
 * @property {Environment[]} environments - An array of environments to display.
 * @property {string} [customCSS] - Optional custom CSS to apply to the page.
 */
export interface StatusPageConfig {
  title: string;
  logo: string;
  currentStatus: StatusType;
  environments: Environment[];
  customCSS?: string;
}

/**
 * SVG icons for each status type.
 * @type {Record<StatusType, string>}
 */
export const ICONS: Record<StatusType, string> = {
  [Status.noissue]: `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 20C15.5229 20 20 15.5228 20 10C20 4.47715 15.5229 0 10 0C4.47716 0 0 4.47715 0 10C0 15.5228 4.47716 20 10 20ZM6 10L9 13L14 8L13 7L9 11L7 9L6 10Z" fill="#6FBA97"/></svg>`,
  [Status.incident]: `<svg viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.77512 18H10H18.2249C19.4574 18 20.2271 16.665 19.6096 15.5983L11.3847 1.39172C10.7684 0.327268 9.23158 0.327264 8.61532 1.39172L0.390434 15.5983C-0.22711 16.665 0.542584 18 1.77512 18ZM9 6H11V11H9V6ZM11 13H9V15H11V13Z" fill="#F2C661"/></svg>`,
  [Status.outage]: `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20ZM5.5 9.5V10.5H14.5V9.5H5.5Z" fill="#D83D4E"/></svg>`,
};

/**
 * Titles for each status type.
 * @type {Record<StatusType, string>}
 */
export const TITLES: Record<StatusType, string> = {
  [Status.noissue]: "All Systems Operational",
  [Status.incident]: "Some Systems Are Experiencing Issues",
  [Status.outage]: "Service Disruption Ongoing",
};

/**
 * Gets the current time in the format "HH:MM GMT/BST".
 * @returns {string} The formatted current time.
 */
export function getCurrentTime(): string {
  const d = new Date();
  const time = d.toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' });
  const timezone = d.getTimezoneOffset() === 0 ? 'GMT' : 'BST';
  return `${time} ${timezone}`;
}

/**
 * Generates HTML for service rows.
 * @param {Service[]} services - An array of services to generate rows for.
 * @returns {string} HTML string of service rows.
 */
function generateServiceRows(services: Service[]): string {
  return services.map(service => `
    <div class="row">
      <div class="cell">
        <div class="service-name">${service.name}</div>
        <div class="status">${TITLES[service.status]}</div>
      </div>
      <div class="cell">
        <div class="icon">${ICONS[service.status]}</div>
      </div>
    </div>
  `).join('');
}

/**
 * Generates HTML for environment tables.
 * @param {Environment[]} environments - An array of environments to generate tables for.
 * @returns {string} HTML string of environment tables.
 */
function generateEnvironmentTables(environments: Environment[]): string {
  const getIcon = (services: Service[]) => {
    if (services.some((s) => s.status === Status.outage)) {
      return ICONS.outage;
    }
    if (services.some((s) => s.status === Status.incident)) {
      return ICONS.incident;
    }
    return ICONS.noissue;
  };
  return environments.map((env, index) => `
    <details ${index === 0 ? 'open' : ''} class="table">
      <summary class="row">
        <div class="cell">${env.name}</div>
        <div class="cell">
          <div class="icon">${getIcon(env.services)}</div>
        </div>
      </summary>
      ${generateServiceRows(env.services)}
    </details>
  `).join('');
}

/**
 * Generates the complete HTML for the status page.
 * @param {StatusPageConfig} config - The configuration for the status page.
 * @returns {string} The complete HTML string for the status page.
 */
export function generateHTML(config: StatusPageConfig): string {
  const currentTime = getCurrentTime();
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.title}</title>
  <link rel="preconnect" href="https://rsms.me/">
  <link rel="stylesheet" href="https://rsms.me/inter/inter.css">
  <style>
    :root {
      font-family: Inter, sans-serif;
      font-feature-settings: 'liga'1, 'calt'1;
    }

    @supports (font-variation-settings: normal) {
      :root {
        font-family: InterVariable, sans-serif;
      }
    }

    body {
      margin: 0;
      min-height: 100vh;
      
      nav {
        position: sticky;
        top: 0;
        z-index: 10;
        padding: 1rem;
        background: white;
        justify-content: space-between;
        align-items: center;
        display: flex;
        
        .links {
          display: flex;
          font-size: 0.9em;
          gap: 0.8em;
          
          a {
            text-decoration: none;
          }
        }
      }
    }

    .header {
      padding: 3rem 1.6rem;
      text-align: center;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      display: flex;
      
      .icon {
        svg {
          width: 3rem;
          display: block;
        }
      }

      h1 {
        margin: 2rem 0 1rem;
        font-size: 1rem;
        line-height: 1.6;
        font-weight: 600;
        max-width: 300px;
      }

      p {
        margin: 0;
        font-size: 0.9em;
        color: gray;
      }
    }
    
    .table {
      margin: auto;
      font-size: 0.9em;
      max-width: 840px;
      flex-direction: column;
      display: flex;
      
      .icon {
        width: 24px;
        align-items: center;
        display: flex;
      }

      .row {
        border-bottom: 1px solid rgba(0,0,0,0.1);
        display: flex;

        .cell {
          gap: 0.6em;
          padding: 1rem 1.1rem;
          flex-direction: unset;
          align-items: center;
          display: flex;
          
          &:first-child {
            justify-content: unset;
            flex-grow: 1;
          }
        }
        &:not(:has(.icon)) {
          .cell {
            font-weight: 600;
          }
        }
      }
    }

    div.table {
      position: sticky;
      top: 46px;
      background: white;
      z-index: 10;

      .cell:not(:has(.icon)) {
        font-weight: 600;
      }
    }

    details.table {
      &:last-of-type {
        padding-bottom: 10rem;

        .row:last-child {
          border-bottom: 0;
        }
      }

      .row {
        border-bottom: 1px solid rgba(0,0,0,0.1);

        .cell {
          &:first-child {
            flex-direction: column;
            justify-content: center;
            align-items: unset;
          }

          &:not(:first-child) {
            justify-content: flex-end;
            font-size: 0.9em;
            color: gray;
          }

          .status {
            font-size: 0.9em;
            font-weight: 400;
            color: gray;
          }
        }
      }

      summary.row {
        font-weight: 600;
        cursor: pointer;

        .cell:first-child {
          flex-direction: row;
          justify-content: unset;
          align-items: center;
          gap: 1em;

          &::before {
            content: '';
            width: 6px;
            height: 6px;
            border: solid currentColor;
            border-width: 2px 2px 0 0;
            transform: rotate(45deg);
          }
        }
      }

      &[open] summary.row .cell:first-child::before {
        margin-top: -3px;
        border-width: 0 2px 2px 0;
      }
    }
    /* Custom styles */
    ${config.customCSS || ''}
  </style>
</head>
<body>
  <nav>
    <div class="logo">
      ${
        config.logo.startsWith('<svg')
          ? config.logo
          : `<img height="22px;" src="${config.logo}" alt="Logo">`
      }
    </div>
    <div class="links">
      <a href="/">View issues</a>
      <a href="/">New issue</a>
    </div>
  </nav>
  <div class="header">
    <div class="icon">${ICONS[config.currentStatus]}</div>
    <h1>${TITLES[config.currentStatus]}</h1>
    <p>Today - ${currentTime}</p>
  </div>
  <div class="table">
    <div class="row">
      <div class="cell">Current status by service</div>
      <div class="cell">
        No issue <div class="icon">${ICONS.noissue}</div>
      </div>
      <div class="cell">
        Incident <div class="icon">${ICONS.incident}</div>
      </div>
      <div class="cell">
        Outage <div class="icon">${ICONS.outage}</div>
      </div>
    </div>
  </div>
  ${generateEnvironmentTables(config.environments)}
</body>
</html>`;
}

/**
 * Creates a status page based on the provided configuration.
 * @param {StatusPageConfig} config - The configuration for the status page.
 * @returns {Response} A Response object containing the generated HTML.
 */
export function createStatusPage(config: StatusPageConfig): Response {
  const statusPage = generateHTML(config);

  return new Response(statusPage, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}