import "./Footer.css";

const Footer: React.FC = () => {
  return (
    <div className="footer">
      <a
        className="footer-element body-s"
        href="https://github.com/malliaridis/penpot-plugin-material-theme-builder/blob/main/docs/getting-started.md"
        target="_blank"
      >
        Instructions
      </a>
      <div className="footer-divider"></div>
      <a
        className="footer-element body-s"
        href="https://github.com/malliaridis/penpot-plugin-material-theme-builder/"
        target="_blank"
      >
        GitHub
      </a>
      <div className="footer-divider"></div>
      <a
        className="footer-element body-s"
        href="https://material.io/"
        target="_blank"
      >
        material.io
      </a>
    </div>
  );
};

export default Footer;
