# polotno-js-angular

**What is Polotno?**

Polotno is a fantastic design editing application that allows users to engage with and build any template. (for custom size as well as social media post)
https://polotno.com/

**Why Polotno?**

Polotno is an opinionated JavaScript library and React components to build canvas editors for several business use cases. It is a canvas editor tool using konvajs.org

**Problem Statement:**

However, Polotno is only available in React components; if you want to integrate this library in the Angular framework, there are many obstacles in embedding React and extending all functionalities in Angular, but here is a step-by-step guide to help you understand.

**Quick Start**

**Create a new Angular Project**

`ng new polotno-js`

**Install these packages**

```
npm install polotno --save

npm install react@17.0.2 --save

npm install react-dom@17.0.2 --save
```

**Add this code in your app.component.html**

`<div id="root"></div>`

**Create a new folder polotno-js inside app folder and create a new file _app.tsx_**

**Copy this code in _app.tsx_ file**

```
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from "polotno";
import { Toolbar } from "polotno/toolbar/toolbar";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import { SidePanel } from "polotno/side-panel";
import { Workspace } from "polotno/canvas/workspace";
import * as React from "react";
import createStore from "polotno/model/store";
import styled from "polotno/utils/styled";
import {
  Button,
  Navbar,
  Alignment,
  Divider,
  Position,
  Menu,
  HTMLSelect,
  Slider,
} from "@blueprintjs/core";
import { observer } from "mobx-react-lite";
import { Popover2 } from "@blueprintjs/popover2";
import * as unit from "polotno/utils/unit";
import { t } from "polotno/utils/l10n";
import { downloadFile } from "polotno/utils/download";

const store = createStore({ key: "pVgGIyr19cAD0U8Z0OD1", showCredit: false });
const page = store.addPage();
page.addElement({
  x: 50,
  y: 50,
});
const NavbarContainer = styled("div")`
  @media screen and (max-width: 500px) {
    overflow-x: auto;
    overflow-y: hidden;
    max-width: 100vw;
  }
`;

const NavInner = styled("div")`
  @media screen and (max-width: 500px) {
    display: flex;
  }
`;
function getName() {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 10; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
const DownloadButton = observer(() => {
  const [saving, setSaving] = React.useState(false);
  const [quality, setQuality] = React.useState(1);
  const [type, setType] = React.useState("jpeg");

  return (
    <Popover2
      content={
        <Menu>
          <li className="bp4-menu-header">
            <h6 className="bp4-heading">File type</h6>
          </li>
          <HTMLSelect
            fill
            onChange={(e) => {
              setType(e.target.value);
              setQuality(1);
            }}
            value={type}
          >
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
            <option value="pdf">PDF</option>
          </HTMLSelect>
          <li className="bp4-menu-header">
            <h6 className="bp4-heading">Size</h6>
          </li>
          <div style={{ padding: "10px" }}>
            <Slider
              value={quality}
              labelRenderer={false}
              // labelStepSize={0.4}
              onChange={(quality) => {
                setQuality(quality);
              }}
              stepSize={0.2}
              min={0.2}
              max={3}
              showTrackFill={false}
            />
            {type === "pdf" && (
              <div>
                {unit.pxToUnitRounded({
                  px: store.width,
                  dpi: store.dpi / quality,
                  precious: 0,
                  unit: "mm",
                })}{" "}
                x{" "}
                {unit.pxToUnitRounded({
                  px: store.height,
                  dpi: store.dpi / quality,
                  precious: 0,
                  unit: "mm",
                })}{" "}
                mm
              </div>
            )}
            {type !== "pdf" && (
              <div>
                {Math.round(store.width * quality)} x{" "}
                {Math.round(store.height * quality)} px
              </div>
            )}
          </div>
          <Button
            fill
            intent="primary"
            loading={saving}
            onClick={async () => {
              if (type === "pdf") {
                setSaving(true);
                await store.saveAsPDF({
                  fileName: getName() + ".pdf",
                  dpi: store.dpi / quality,
                  pixelRatio: 2 * quality,
                });
                setSaving(false);
              } else {
                store.pages.forEach((page, index) => {
                  // do not add index if we have just one page
                  const indexString =
                    store.pages.length > 1 ? "-" + (index + 1) : "";
                  store.saveAsImage({
                    pageId: page.id,
                    pixelRatio: quality,
                    mimeType: "image/" + type,
                    fileName: getName() + indexString + "." + type,
                  });
                });
              }
            }}
          >
            Download {type.toUpperCase()}
          </Button>
        </Menu>
      }
      position={Position.BOTTOM_RIGHT}
    >
      <Button
        icon="import"
        text={t("toolbar.download")}
        intent="primary"
        loading={saving}
        onClick={() => {
          setQuality(1);
        }}
      />
    </Popover2>
  );
});
export const App = () => {
  const [show, setShow] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  return (
    <div className="bp4-light">
      <NavbarContainer className="bp4-navbar">
        <NavInner>
          <Navbar.Group align={Alignment.LEFT}>
            <Button
              icon="new-object"
              minimal
              onClick={() => {
                const ids = store.pages
                  .map((page) => page.children.map((child) => child.id))
                  .flat();
                const hasObjects = ids?.length;
                if (hasObjects) {
                  if (!window.confirm("Remove all content for a new design?")) {
                    return;
                  }
                  const pagesIds = store.pages.map((p) => p.id);
                  store.deletePages(pagesIds);
                  store.addPage();
                }
              }}
            >
              New
            </Button>
            <Button
              icon="floppy-disk"
              minimal
              loading={saving}
              onClick={async () => {
                const json = store.toJSON();
                setSaving(true);
                const url =
                  "data:text/json;base64," +
                  window.btoa(
                    unescape(encodeURIComponent(JSON.stringify(json)))
                  );

                downloadFile(url, "polotno.json");
              }}
            >
              Save My Design
            </Button>
          </Navbar.Group>
          <Navbar.Group align={Alignment.RIGHT}>
            <Divider />
            <DownloadButton />
            <Divider />
          </Navbar.Group>
        </NavInner>
      </NavbarContainer>
      <PolotnoContainer
        style={{ height: "90vh" }}
        className="polotno-app-container"
      >
        {" "}
        <SidePanelWrap>
          <SidePanel store={store} />
        </SidePanelWrap>
        <WorkspaceWrap>
          <Toolbar store={store} />
          <Workspace store={store} />
          <ZoomButtons store={store} />
        </WorkspaceWrap>
      </PolotnoContainer>
    </div>
  );
};
```

**Now just Add this code in your _app.component.ts_**

```

import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { App } from './polotno-js/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit{
  title = 'polotno-js';
  ngOnInit(): void {}

  public ngOnChanges() {
    this.renderComponent();
  }

  public ngAfterViewInit() {
    this.renderComponent();
  }

  private renderComponent() {
       ReactDOM.render(
        React.createElement(App) 
      ,document.getElementById('root')
      );
  }
}

```
**Now change some setting in your _tsconfig.ts_ file inside _compilerOptions_ object**

```
"jsx": "react",
"skipLibCheck": true,
"noImplicitAny": true,
```

**Put some polotno default css in _index.html_**

```
<link href="https://unpkg.com/@blueprintjs/icons@4/lib/css/blueprint-icons.css" rel="stylesheet"/>
<link href="https://unpkg.com/@blueprintjs/core@4/lib/css/blueprint.css"
      rel="stylesheet"/>

<link href="https://unpkg.com/@blueprintjs/popover2@1/lib/css/blueprint-popover2.css" rel="stylesheet"/>

```
**Now run your project and open the browser**
`npm start` 

**Over To You!**
check codesandbox sample https://codesandbox.io/s/bj-polotno-angular-10wx3x



