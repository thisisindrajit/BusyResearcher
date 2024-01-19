const SvgLoading = ({
  height = "48",
  width = "48",
}: {
  height?: string;
  width?: string;
}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 512 512">
      <g transform="matrix(0, 1, -1, 0, 470.501556, 21.386433)">
        <g>
          <circle
            style={{
              fill: "rgba(112, 98, 192, 0)",
              strokeWidth: "5.9135px",
              stroke: "rgb(112, 98, 192)",
            }}
            cx="234.513"
            cy="255.899"
            r="232.464"
            transform="matrix(0, -0.682763, 0.670073, 0, 44.973633, 381.72467)"
          ></circle>

          <circle
            id="1"
            style={{
              fill: "rgb(112, 98, 192)",
              strokeWidth: "5.9135px",
              stroke: "rgb(112, 98, 192)",
            }}
            cx="234.513"
            cy="255.899"
            r="232.464"
            transform="matrix(0, -0.14346, 0.140287, 0, 60.339737, 352.595886)"
          ></circle>
          <circle
            id="2"
            style={{
              fill: "rgb(112, 98, 192)",
              strokeWidth: "5.9135px",
              stroke: "rgb(112, 98, 192)",
            }}
            cx="234.513"
            cy="255.899"
            r="232.464"
            transform="matrix(0, -0.14346, 0.140287, 0, 53.702332, 166.755417)"
          ></circle>
          <circle
            id="3"
            style={{
              fill: "rgb(112, 98, 192)",
              strokeWidth: "5.9135px",
              stroke: "rgb(112, 98, 192)",
            }}
            cx="234.513"
            cy="255.899"
            r="232.464"
            transform="matrix(0, -0.14346, 0.140287, 0, 224.793839, 107.020905)"
          ></circle>
          <circle
            id="4"
            style={{
              fill: "rgb(112, 98, 192)",
              strokeWidth: "5.9135px",
              stroke: "rgb(112, 98, 192)",
            }}
            cx="234.513"
            cy="255.899"
            r="232.464"
            transform="matrix(0, -0.14346, 0.140287, 0, 334.675781, 249.351364)"
          ></circle>
          <circle
            id="5"
            style={{
              fill: "rgb(112, 98, 192)",
              strokeWidth: "5.9135px",
              stroke: "rgb(112, 98, 192)",
            }}
            cx="234.513"
            cy="255.899"
            r="232.464"
            transform="matrix(0, -0.14346, 0.140287, 0, 230.693512, 401.268677)"
          ></circle>

          <animate
            id="a1-1"
            href="#1"
            attributeName="cx"
            from="234.513"
            to="234.513"
            values="234.513; 84.513; 234.513"
            dur="0.5s"
            begin="0s;a1-1.end + 1.5s"
            fill="freeze"
          />
          <animate
            id="a1-2"
            href="#1"
            attributeName="cy"
            from="255.899"
            to="255.899"
            values="255.899; 105.899; 255.899"
            dur="0.5s"
            begin="0s;a1-2.end + 1.5s"
            fill="freeze"
          />

          <animate
            id="a2-1"
            href="#2"
            attributeName="cx"
            from="234.513"
            to="234.513"
            values="234.513; 384.513; 234.513"
            dur="0.5s"
            begin="0.3s;a1-1.end + 0.3s"
            fill="freeze"
          />
          <animate
            id="a2-2"
            href="#2"
            attributeName="cy"
            from="255.899"
            to="255.899"
            values="255.899; 105.899; 255.899"
            dur="0.5s"
            begin="0.3s;a1-2.end + 0.3s"
            fill="freeze"
          />

          <animate
            id="a3-1"
            href="#3"
            attributeName="cx"
            from="234.513"
            to="234.513"
            values="234.513; 384.513; 234.513"
            dur="0.5s"
            begin="0.6s;a1-1.end + 0.6s"
            fill="freeze"
          />
          <animate
            id="a3-2"
            href="#3"
            attributeName="cy"
            from="255.899"
            to="255.899"
            values="255.899; 405.899; 255.899"
            dur="0.5s"
            begin="0.6s;a1-2.end + 0.6s"
            fill="freeze"
          />

          <animate
            id="a4-1"
            href="#4"
            attributeName="cx"
            from="234.513"
            to="234.513"
            values="234.513; 234.513; 234.513"
            dur="0.5s"
            begin="0.9s;a1-1.end + 0.9s"
            fill="freeze"
          />
          <animate
            id="a4-2"
            href="#4"
            attributeName="cy"
            from="255.899"
            to="255.899"
            values="255.899; 455.899; 255.899"
            dur="0.5s"
            begin="0.9s;a1-2.end + 0.9s"
            fill="freeze"
          />

          <animate
            id="a5-1"
            href="#5"
            attributeName="cx"
            from="234.513"
            to="234.513"
            values="234.513; 34.513; 234.513"
            dur="0.5s"
            begin="1.2s;a1-1.end + 1.2s"
            fill="freeze"
          />
          <animate
            id="a5-2"
            href="#5"
            attributeName="cy"
            from="255.899"
            to="255.899"
            values="255.899; 255.899; 255.899"
            dur="0.5s"
            begin="1.2s;a1-2.end + 1.2s"
            fill="freeze"
          />
        </g>
      </g>
    </svg>
  );
};

export default SvgLoading;
