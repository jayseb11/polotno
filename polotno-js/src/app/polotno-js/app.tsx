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
