import { useEffect, useState } from "react";
const modulo = (a, n) => (a % n + n) % n;
const UNFOCUSED = -1;
const useMenuFocus = ({
  localRef,
  isMenuOpen,
  close,
  onOpen,
  onClose,
  onKeyDown
}) => {
  const [focusedItem, setFocusedItem] = useState(UNFOCUSED);
  useEffect(() => {
    if (isMenuOpen) {
      setFocusedItem(0);
    }
  }, [isMenuOpen]);
  useEffect(() => {
    const menuItems = localRef.current?.querySelectorAll(
      '[data-role="menuitem"]:not([data-disabled])'
    );
    menuItems?.[focusedItem]?.focus();
    if (menuItems) {
      for (const [i, menuItem] of menuItems.entries()) {
        menuItem.tabIndex = i === focusedItem ? 0 : -1;
      }
    }
  }, [localRef, focusedItem]);
  useEffect(() => {
    onOpen?.(setFocusedItem);
  }, []);
  const handleKeys = (event) => {
    const menuItems = localRef?.current?.querySelectorAll(
      '[data-role="menuitem"]:not([data-disabled])'
    );
    const menuItemsCount = menuItems?.length ?? 0;
    switch (event.key) {
      case "ArrowUp": {
        event.preventDefault();
        event.stopPropagation();
        setFocusedItem(modulo(focusedItem - 1, menuItemsCount));
        break;
      }
      case "ArrowDown": {
        event.preventDefault();
        event.stopPropagation();
        setFocusedItem(modulo(focusedItem + 1, menuItemsCount));
        break;
      }
      case "ArrowLeft": {
        event.preventDefault();
        event.stopPropagation();
        setFocusedItem(UNFOCUSED);
        close?.();
        break;
      }
      case "Home": {
        event.preventDefault();
        event.stopPropagation();
        setFocusedItem(0);
        break;
      }
      case "End": {
        event.preventDefault();
        event.stopPropagation();
        setFocusedItem(menuItemsCount - 1);
        break;
      }
      case "Enter": {
        event.preventDefault();
        event.stopPropagation();
        menuItems?.[focusedItem]?.click();
        break;
      }
      case "Escape": {
        onClose?.();
        break;
      }
      case "Tab": {
        event.preventDefault();
        onClose?.();
        break;
      }
      default: {
        break;
      }
    }
    onKeyDown?.(event);
  };
  return [handleKeys];
};
export {
  useMenuFocus
};
