import MockTarget from './MockTarget';
import * as defaultConfig from '../../src/DEFAULTS';
import makeRequest from '../../src/makeRequest';
import runCommand from '../../src/commands/run';

jest.mock('../../src/makeRequest');

let subject;
let config;
let sha;

beforeEach(() => {
  makeRequest.mockImplementation(() => Promise.resolve({}));
  sha = 'foobar';
  config = Object.assign({}, defaultConfig, {
    targets: { chrome: new MockTarget() },
    include: 'test/integrations/examples/*-react-happo.js*',
  });
  subject = () => runCommand(sha, config, {});
});

it('produces the right html', async () => {
  await subject();
  expect(config.targets.chrome.snapPayloads).toEqual([
    {
      component: 'Foo-react',
      css: '',
      hash: '4a799dea4acaa048759c5904ff84a771',
      html: '<button>Click meish</button>',
      variant: 'anotherVariant',
    },
    {
      component: 'Foo-react',
      css: '',
      hash: 'be095fe82721f1c2d42bd71c51c88221',
      html: '<button>I am in a portal</button>',
      variant: 'portalExample',
    },
    {
      component: 'Foo-react',
      css: '',
      hash: '502965779a56c9455aef99da7448aeec',
      html: '<button>Ready</button>',
      variant: 'asyncExample',
    },
    {
      component: 'Foo-react',
      css: '',
      hash: '4bd96873b61366f3587e1474e0e1c13a',
      html: '<button>Click me</button>',
      variant: 'default',
    },
  ]);
});

it('produces the right css', async () => {
  await subject();
  expect(config.targets.chrome.globalCSS).toEqual(
    `
   button { text-align: center }\nbutton { color: red }
    `.trim(),
  );
});
