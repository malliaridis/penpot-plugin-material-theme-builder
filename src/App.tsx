import "./App.css";

function App() {
  return (
    <>
      <p className="body-m">
        Material theme builder that allows you to generate assets based on
        Material 3.
      </p>
      <div className="form-group">
        <label className="input-label body-m" htmlFor="input-theme-name">
          Theme Name
        </label>
        <input
          className="input"
          type="text"
          placeholder="material-theme"
          id="input-theme-name"
        />
        <div style={{ height: "var(--spacing-16)" }}></div>
        <label
          className="input-label body-m"
          htmlFor="input-source-color-value"
        >
          Source Color
        </label>
        <div id="source-color-input" className="input color-input" tabIndex={3}>
          <input
            type="color"
            className="color-picker"
            id="input-source-color-block"
            value="#673AB7"
            tabIndex={4}
          />
          <input
            type="text"
            className="input color-input-text"
            id="input-source-color-value"
            value="#673AB7"
            tabIndex={5}
          />
        </div>
      </div>

      <div style={{ height: "var(--spacing-24)" }}></div>

      <button
        type="button"
        data-appearance="primary"
        className="full-width-button"
        data-handler="generate-theme"
      >
        Generate Theme
      </button>
    </>
  );
}

export default App;
