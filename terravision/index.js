import fs from 'fs';
import process from 'process';

async function readGraphInput() {
  let graph = '';

  // read graph from stdin
  process.stdin.setEncoding('utf8');
  for await (const chunk of process.stdin) {
    graph += chunk;
  }

  return graph;
}

async function transformResourceGraph() {
  // read graph from stdin
  let graph = await readGraphInput();

  // load resource identifiers from json file
  const resourceIdentifiers = JSON.parse(
    fs.readFileSync('/app/resourceIdentifiers.json', 'utf8')
  );

  // load terraform to aws resource mapping
  const terraformToAws = JSON.parse(
    fs.readFileSync('/app/terraformToAws.json', 'utf8')
  );

  const resourcePattern = /aws\w+\.\w+/g;

  const resourceIdentifiersInGraph = new Set(graph.match(resourcePattern));

  for (const identifier of resourceIdentifiersInGraph) {
    const terraformIdentifier = identifier.split('.')[0].replaceAll('"', '');
    const terraformName = identifier.split('.')[1].replaceAll('"', '');
    const resourceIdentifier = terraformToAws[terraformIdentifier];

    graph = graph.replaceAll(
      identifier,
      `${resourceIdentifier}.${terraformName}`
    );

    let icon;

    if (resourceIdentifier in resourceIdentifiers) {
      icon = resourceIdentifiers[resourceIdentifier];
    } else if (resourceIdentifier) {
      // find generic icon
      const [, service] = resourceIdentifier.split('::');
      icon = Object.entries(resourceIdentifiers).find(
        ([key, value]) =>
          key.startsWith(`aws::${service}`) &&
          value.endsWith('service_icon.png')
      )?.[1];
    }

    if (icon) {
      graph = graph.replaceAll(
        `label="${resourceIdentifier}.${terraformName}"`,
        `label=< <table border="0" cellborder="1"><tr><td bgcolor="white">${resourceIdentifier}</td></tr><tr><td bgcolor="white">${terraformName}</td></tr></table> >, labelloc="b" image="${icon}", shape=none, width=2.5, height=2.5, fixedsize=true`
      );
    }
  }

  // insert imagepath
  const lines = graph.split('\n');
  lines.splice(
    2,
    0,
    `  imagepath="/app/node_modules/@aws/pdk/assets/aws-arch"\n  nodesep=2\n  ranksep=1`
  );
  graph = lines.join('\n');

  console.log(graph);
}

transformResourceGraph();
