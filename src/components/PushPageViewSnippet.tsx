export default function PushPageViewSnippet() {
  return (
    <div className="code-panel">
      <div className="code-panel-head">
        <span className="code-panel-lang">TypeScript</span>
        <span className="code-panel-copy">Copy</span>
      </div>
      <pre>
        <code>
          <span className="tok-kw">export function</span> <span className="tok-fn">pushPageView</span>
          <span className="tok-pu">():</span> <span className="tok-pu">void</span>{" "}
          <span className="tok-pu">{"{"}</span>
          {"\n  window.dataLayer "}
          <span className="tok-pu">=</span>
          {" window.dataLayer "}
          <span className="tok-pu">||</span> <span className="tok-pu">[]</span>
          {"\n  window.dataLayer."}
          <span className="tok-fn">push</span>
          <span className="tok-pu">({"{"}</span>
          {"\n    event"}
          <span className="tok-pu">:</span> <span className="tok-str">&apos;page_render_mode_set&apos;</span>
          <span className="tok-pu">,</span>
          {"\n    page_render_mode"}
          <span className="tok-pu">:</span> <span className="tok-str">&apos;mpa&apos;</span>
          <span className="tok-pu">,</span>
          {"\n  "}
          <span className="tok-pu">{"})"}</span>
          {"\n"}
          <span className="tok-pu">{"}"}</span>
        </code>
      </pre>
    </div>
  );
}
