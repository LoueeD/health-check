import { Environment, Service, Status, type StatusPageConfig, type StatusType } from "../mod.ts";

/**
 * Configuration options for using Gridfox as a database.
 * @interface GridfoxConfig
 * @property {string} apiKey - Your Gridfox API Key
 * @property {string} brandingTableName - The name of the table for branding
 * @property {string} environmentsTableName - The name of the table for environments
 * @property {string} issuesTableName - The name of the table for issues
 * @property {string} issueStatusListFieldName - The name of the status field for each issue
 * @property {string[]} openIssueListItems - Array containing each open issue status
 * @property {string} proxyApiUrl - Override default production Gridfox API url
 */
export interface GridfoxConfig {
  apiKey: string;
  brandingTableName?: string;
  environmentsTableName: string;
  issuesTableName: string;
  issueStatusListFieldName: string,
  openIssueListItems: string[],
  issueStatusType: (issue: Record<string, unknown>) => StatusType,
  proxyApiUrl?: string;
}

/**
 * Fetch and transform Gridfox data into.
 * @param {GridfoxConfig} config - Provide details about your Gridfox project
 * @returns {Promise<StatusPageConfig>} StatusPageConfig 
 */
export const configFromGridfox = async (config: GridfoxConfig): Promise<StatusPageConfig> => {
  const root = config.proxyApiUrl || 'https://api.gridfox.com';
  const headers = new Headers({
    'gridfox-api-key': config.apiKey,
    'content-type': 'application/json',
  });
  const fetchGridfox = async (tableName: string, filter: string) => {
    const res = await fetch(`${root}/data/${tableName}${filter}`, { headers });
    return (await res.json()).records;
  };
  const environmentRecords = await fetchGridfox(config.environmentsTableName, '?paged=false');
  const issueRecords = await fetchGridfox(
    config.issuesTableName,
    `?paged=false&$filter=${config.issueStatusListFieldName} in (${config.openIssueListItems.map((item) => `'${item}'`).join(',')})`,
  );

  const environments: Environment[] = environmentRecords.map((env: any) => {
    return {
      name: env.name,
      services: env.services.map((s: any) => {
        const scopedIssues: Array<any> = issueRecords.filter(
          (issue: any) => issue.service === s.referenceFieldValue
            && issue.environment === env.name,
        );
        const incidentIssues = scopedIssues.filter((i: any) => config.issueStatusType(i) === Status.incident);
        const outageIssues = scopedIssues.filter((i: any) => config.issueStatusType(i) === Status.outage);

        let status: StatusType = 'noissue';
        if (incidentIssues.length) {
          status = 'incident';
        }
        if (outageIssues.length) {
          status = 'outage';
        }

        return { name: s.referenceFieldValue, status };
      })
    }
  });

  let currentStatus: StatusType = Status.noissue;
  if (environments.some((e) => e.services.some((s) => s.status === Status.incident))) {
    currentStatus = Status.incident;
  }
  if (environments.some((e) => e.services.some((s) => s.status === Status.outage))) {
    currentStatus = Status.outage;
  }

  const pageConfig: StatusPageConfig = {
    title: '',
    logo: '',
    currentStatus,
    environments,
  };
  return pageConfig; 
};