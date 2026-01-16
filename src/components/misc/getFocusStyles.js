export const getFocusStyles = (theme) => ({
    outline: '2px dotted transparent',
    outlineOffset: '2px',
    boxShadow: `0 0 0 2px ${theme.colors.background.canvas}, 0 0 0px 4px ${theme.colors.primary.main}`,
    transitionTimingFunction: 'cubic-bezier(0.19, 1, 0.22, 1)',
    transitionDuration: '0.2s',
    transitionProperty: 'outline, outline-offset, box-shadow',
  });
  
  export const getMouseFocusStyles = () => ({
    outline: '2px dotted transparent',
    outlineOffset: '2px',
    boxShadow: 'none',
  });