import Downshift from "downshift";
import { useCallback, useState, useLayoutEffect, useRef } from "react";
import classNames from "classnames";
import { DropdownPosition, GetDropdownPositionFn, InputSelectOnChange, InputSelectProps } from "./types";

export function InputSelect<TItem>({
  label,
  defaultValue,
  onChange: consumerOnChange,
  items,
  parseItem,
  isLoading,
  loadingLabel,
}: InputSelectProps<TItem>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedValue, setSelectedValue] = useState<TItem | null>(defaultValue ?? null);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({
    top: 0,
    left: 0,
  });

  const onChange = useCallback<InputSelectOnChange<TItem>>(
    (selectedItem) => {
      if (selectedItem === null) {
        return;
      };

      consumerOnChange(selectedItem);
      setSelectedValue(selectedItem);
    },
    [consumerOnChange]
  );

  useLayoutEffect(() => {
    function handleResize() {
      setDropdownPosition(getDropdownPosition(inputRef.current))
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      <Downshift<TItem>
        id="RampSelect"
        onChange={onChange}
        selectedItem={selectedValue}
        itemToString={(item) => (item ? parseItem(item).label : "")}
      >
        {({
          getItemProps,
          getLabelProps,
          getMenuProps,
          isOpen,
          highlightedIndex,
          selectedItem,
          getToggleButtonProps,
          inputValue,
        }) => {
          const toggleProps = getToggleButtonProps();
          const parsedSelectedItem = selectedItem === null ? null : parseItem(selectedItem);

          return (
            <div className="RampInputSelect--root">
              <label className="RampText--s RampText--hushed" {...getLabelProps()}>
                {label}
              </label>
              <div className="RampBreak--xs" />
              <div
                className="RampInputSelect--input"
                onClick={(event) => {
                  setDropdownPosition(getDropdownPosition(inputRef.current))
                  toggleProps.onClick(event)
                }}
                ref={inputRef}
              >
                {inputValue}
              </div>

              <div
                className={classNames("RampInputSelect--dropdown-container", {
                  "RampInputSelect--dropdown-container-opened": isOpen,
                })}
                {...getMenuProps()}
                style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
              >
                {renderItems()}
              </div>
            </div>
          );

          function renderItems() {
            if (!isOpen) {
              return null;
            };

            if (isLoading) {
              return <div className="RampInputSelect--dropdown-item">{loadingLabel}...</div>
            };

            if (items.length === 0) {
              return <div className="RampInputSelect--dropdown-item">No items</div>
            };

            return items.map((item, index) => {
              const parsedItem = parseItem(item);
              return (
                <div
                  key={parsedItem.value}
                  {...getItemProps({
                    key: parsedItem.value,
                    index,
                    item,
                    className: classNames("RampInputSelect--dropdown-item", {
                      "RampInputSelect--dropdown-item-highlighted": highlightedIndex === index,
                      "RampInputSelect--dropdown-item-selected":
                        parsedSelectedItem?.value === parsedItem.value,
                    }),
                  })}
                >
                  {parsedItem.label}
                </div>
              );
            });
          };
        }};
      </Downshift>
    </div>
  );
};

const getDropdownPosition: GetDropdownPositionFn = (target) => {
  if (target instanceof Element) {
    const { top, left } = target.getBoundingClientRect();
    const { scrollY } = window;
    return {
      top: scrollY + top - 9,
      left,
    };
  };

  return { top: 0, left: 0 };
};
