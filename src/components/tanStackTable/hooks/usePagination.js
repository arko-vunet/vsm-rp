const range = (start, end) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, i) => start + i);
};
function usePagination(props) {
  const {
    boundaryCount = 1,
    count = 1,
    disabled = false,
    hideNextButton = false,
    hidePrevButton = false,
    onChange: handleChange,
    page,
    showFirstButton = false,
    showLastButton = false,
    siblingCount = 1,
    ...other
  } = props;
  const handleClick = (event, value) => {
    if (handleChange && value !== null) {
      handleChange(event, value);
    }
  };
  const startPages = range(1, Math.min(boundaryCount, count));
  const endPages = range(Math.max(count - boundaryCount + 1, boundaryCount + 1), count);
  const siblingsStart = Math.max(
    Math.min(
      // Natural start
      page - siblingCount,
      // Lower boundary when page is high
      count - boundaryCount - siblingCount * 2 - 1
    ),
    // Greater than startPages
    boundaryCount + 2
  );
  const siblingsEnd = Math.min(
    Math.max(
      // Natural end
      page + siblingCount,
      // Upper boundary when page is low
      boundaryCount + siblingCount * 2 + 2
    ),
    // Less than endPages
    count - boundaryCount - 1
  );
  const itemList = [
    ...showFirstButton ? ["first"] : [],
    ...hidePrevButton ? [] : ["previous"],
    ...startPages,
    // Start ellipsis
    ...siblingsStart > boundaryCount + 2 ? ["start-ellipsis"] : boundaryCount + 1 < count - boundaryCount ? [boundaryCount + 1] : [],
    // Sibling pages
    ...range(siblingsStart, siblingsEnd),
    // End ellipsis
    ...siblingsEnd < count - boundaryCount - 1 ? ["end-ellipsis"] : count - boundaryCount > boundaryCount ? [count - boundaryCount] : [],
    ...endPages,
    ...hideNextButton ? [] : ["next"],
    ...showLastButton ? ["last"] : []
  ];
  const buttonPage = (type) => {
    switch (type) {
      case "first": {
        return 1;
      }
      case "previous": {
        return page - 1;
      }
      case "next": {
        return page + 1;
      }
      case "last": {
        return count;
      }
      default: {
        return null;
      }
    }
  };
  const items = itemList.map((item) => {
    return typeof item === "number" ? {
      handleOnClick: (event) => {
        handleClick(event, item);
      },
      type: "page",
      page: item,
      selected: item === page,
      disabled,
      "aria-current": item === page ? "page" : void 0
    } : {
      handleOnClick: (event) => {
        handleClick(event, buttonPage(item));
      },
      type: item,
      page: buttonPage(item),
      selected: false,
      disabled: disabled || !item.includes("ellipsis") && (item === "next" || item === "last" ? page >= count : page <= 1)
    };
  });
  return {
    items,
    ...other
  };
}
export {
  usePagination as default
};
