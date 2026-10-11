export default function PushPageViewSnippet() {
  return (
    <div className="code-panel">
      <div className="code-panel-head">
        <span className="code-panel-lang">HTML</span>
        <span className="code-panel-copy">Copy</span>
      </div>
      <pre>
        <code>
          <span className="tok-pu">{"<script>"}</span>
          {"\n  window.dataLayer "}
          <span className="tok-pu">=</span>
          {" window.dataLayer "}
          <span className="tok-pu">||</span> <span className="tok-pu">[]</span>
          <span className="tok-pu">;</span>
          {"\n  window.dataLayer."}
          <span className="tok-fn">push</span>
          <span className="tok-pu">({"{"}</span>
          {" page_render_mode"}
          <span className="tok-pu">:</span> <span className="tok-str">&apos;mpa&apos;</span>
          {" "}
          <span className="tok-pu">{"})"}</span>
          <span className="tok-pu">;</span>
          {"\n"}
          <span className="tok-pu">{"</script>"}</span>
          {"\n"}
          <span className="tok-kw">{"<!-- placed in <head>, before the GTM container snippet -->"}</span>
        </code>
      </pre>
    </div>
  );
}
