# Minimal Status Page Library

A flexible and customizable status page generator for applications. This library allows you to easily create and serve a status page for your services and environments.

[Demo at minimal-status-page.deno.dev](https://minimal-status-page.deno.dev)

## Features

- Easy to set up and configure
- Customizable appearance with custom CSS support
- Support for multiple environments and services
- Real-time status updates
- Responsive design
- Built for zero build

## Installation

To use this library in your Deno project, you can import it directly from the GitHub repository:

```typescript
import { createStatusPage, StatusPageConfig } from "jsr:@loui/status";
```

## Usage

Here's a basic example of how to use the status page library:

```typescript
import { createStatusPage, StatusPageConfig } from "jsr:@loui/status";

const config: StatusPageConfig = {
  title: "My Company Status",
  logo: "https://example.com/logo.png",
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
        { name: "Database", status: "noissue" },
      ],
    },
  ],
  customCSS: `
    /* Add any custom styles here */
    body { background-color: #f0f0f0; }
  `,
};

Deno.serve(() => createStatusPage(config));
```

This will start a Deno server that serves your status page.

## Configuration Options

The `StatusPageConfig` interface accepts the following options:

- `title`: The title of your status page
- `logo`: URL to your company logo
- `currentStatus`: Overall status of your services (`"noissue"`, `"incident"`, or `"outage"`)
- `environments`: An array of environments, each containing an array of services
- `customCSS` (optional): A string of custom CSS to be applied to the status page

## Customization

You can customize the appearance of your status page by providing custom CSS in the `customCSS` field of the configuration object. This allows you to match the status page to your brand's look and feel.

## Gridfox Support

You can also store your data in a Gridfox project, then import `configFromGridfox` which will fetch and transform your projects data into a `StatusPageConfig` object.

```typescript
const apiKey = Deno.env.get('GRIDFOX_API_KEY');
if (!apiKey) throw new Error('Provide a gridfox API Key');

const config = await configFromGridfox({
  apiKey,
  environmentsTableName: 'Environments',
  issuesTableName: 'Issues',
  issueStatusListFieldName: 'Status',
  openIssueListItems: ['New', 'In Progress'],
  issueStatusType: (issue): StatusType => {
    console.log(issue.type);
    if (issue.type === 'Bug') {
      return Status.incident;
    }
    if(issue.type === 'Outage') {
      return Status.outage;
    }
    return Status.noissue;
  },
});
return createStatusPage(config)
```

## Running the Status Page

To run your status page, use the following command:

```
deno run --allow-net your_status_page_file.ts
```

Make sure to grant the necessary permissions for network access.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## TODO

- Add support for Cloudflare Workers
- Add support for Azure Functions
- Implement real-time updates using WebSockets
- Add more customization options
- Create examples for different use cases

## Support

If you encounter any problems or have any questions, please open an issue on the GitHub repository.