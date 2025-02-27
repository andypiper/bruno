import React from 'react';
import get from 'lodash/get';
import filter from 'lodash/filter';
import { Inspector } from 'react-inspector';
import { useTheme } from 'providers/Theme';
import { findEnvironmentInCollection } from 'utils/collections';
import StyledWrapper from './StyledWrapper';

const KeyValueExplorer = ({ data, theme }) => {
  data = data || {};

  return (
    <div>
      <table className="border-collapse">
        <tbody>
          {Object.entries(data).map(([key, value]) => (
            <tr key={key}>
              <td className="px-2 py-1">{key}</td>
              <td className="px-2 py-1">
                <Inspector data={value} theme={theme} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const EnvVariables = ({ collection, theme }) => {
  const environment = findEnvironmentInCollection(collection, collection.activeEnvironmentUid);

  if (!environment) {
    return (
      <>
        <h1 className="font-semibold mt-4 mb-2">Environment Variables</h1>
        <div className="muted text-xs">No environment selected</div>
      </>
    );
  }

  const envVars = get(environment, 'variables', []);
  const enabledEnvVars = filter(envVars, (variable) => variable.enabled);
  const envVarsObj = enabledEnvVars.reduce((acc, curr) => {
    acc[curr.name] = curr.value;
    return acc;
  }, {});

  return (
    <>
      <div className="flex items-center mt-4 mb-2">
        <h1 className="font-semibold">Environment Variables</h1>
        <span className="muted ml-2">({environment.name})</span>
      </div>
      {enabledEnvVars.length > 0 ? (
        <KeyValueExplorer data={envVarsObj} theme={theme} />
      ) : (
        <div className="muted text-xs">No environment variables found</div>
      )}
    </>
  );
};

const CollectionVariables = ({ collection, theme }) => {
  const collectionVariablesFound = Object.keys(collection.collectionVariables).length > 0;

  return (
    <>
      <h1 className="font-semibold mb-2">Collection Variables</h1>
      {collectionVariablesFound ? (
        <KeyValueExplorer data={collection.collectionVariables} theme={theme} />
      ) : (
        <div className="muted text-xs">No collection variables found</div>
      )}
    </>
  );
};

const VariablesEditor = ({ collection }) => {
  const { storedTheme } = useTheme();

  const reactInspectorTheme = storedTheme === 'light' ? 'chromeLight' : 'chromeDark';

  return (
    <StyledWrapper className="px-4 py-4">
      <CollectionVariables collection={collection} theme={reactInspectorTheme} />
      <EnvVariables collection={collection} theme={reactInspectorTheme} />

      <div className="mt-8 muted text-xs">
        Note: As of today, collection variables can only be set via the api -{' '}
        <span className="font-medium">getVar()</span> and <span className="font-medium">setVar()</span>. <br />
        In the next release, we will add a UI to set and modify collection variables.
      </div>
    </StyledWrapper>
  );
};

export default VariablesEditor;
