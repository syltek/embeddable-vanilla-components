import { DataResponse } from '@embeddable.com/core';
import { useEmbeddableState } from '@embeddable.com/react';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { twMerge } from 'tailwind-merge';

import Checkbox from '../../../icons/Checkbox';
import CheckboxEmpty from '../../../icons/CheckboxEmpty';
import Container from '../../Container';
import Spinner from '../../Spinner';
import { ChevronDown, ClearIcon } from '../../icons';

export type Props = {
  className?: string;
  options: DataResponse;
  unclearable?: boolean;
  onChange: (v: string[]) => void;
  searchProperty?: string;
  minDropdownWidth?: number;
  property?: { name: string; title: string; nativeType: string; __type__: string };
  title?: string;
  defaultValue?: string[];
  placeholder?: string;
  ds?: { embeddableId: string; datasetId: string; variableValues: Record };
};

type Record = { [p: string]: string };

let debounce: number | undefined = undefined;

export default (props: Props) => {
  const [focus, setFocus] = useState(false);
  const ref = useRef<HTMLInputElement | null>(null);
  const [triggerBlur, setTriggerBlur] = useState(false);
  const [value, setValue] = useState(props.defaultValue);
  const [search, setSearch] = useState('');
  const [_, setServerSearch] = useEmbeddableState({
    [props.searchProperty || 'search']: '',
  }) as [Record, (f: (m: Record) => Record) => void];

  useEffect(() => {
    setValue(props.defaultValue);
  }, [props.defaultValue]);

  const performSearch = useCallback(
    (newSearch: string) => {
      setSearch(newSearch);

      clearTimeout(debounce);

      debounce = window.setTimeout(() => {
        setServerSearch((s) => ({ ...s, [props.searchProperty || 'search']: newSearch }));
      }, 500);
    },
    [setSearch, setServerSearch, props.searchProperty],
  );

  const set = useCallback(
    (newValue: string) => {
      performSearch('');

      let newValues: string[] = [];

      if (newValue !== '') {
        newValues = value || [];
        if (newValues?.includes(newValue)) {
          newValues = newValues.filter((v) => v !== newValue);
        } else {
          newValues = [...newValues, newValue];
        }
      }

      props.onChange(newValues);
      setValue(newValues);
      setServerSearch((s) => ({ ...s, [props.searchProperty || 'search']: '' }));
      clearTimeout(debounce);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [performSearch, props, value],
  );

  useLayoutEffect(() => {
    if (!triggerBlur) return;

    const timeout = setTimeout(() => {
      setFocus(false);
      setTriggerBlur(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [triggerBlur]);

  const list = useMemo(
    () =>
      props.options?.data?.reduce((memo, o, i: number) => {
        memo.push(
          <div
            key={i}
            onClick={() => {
              setTriggerBlur(false);
              set(o[props.property?.name || ''] || '');
            }}
            className={`flex items-center min-h-[36px] px-3 py-2 hover:bg-black/5 cursor-pointer font-normal gap-1 ${
              value?.includes(o[props.property?.name || '']) ? 'bg-black/5' : ''
            } whitespace-nowrap overflow-hidden text-ellipsis`}
          >
            {value?.includes(o[props.property?.name || '']) ? <Checkbox /> : <CheckboxEmpty />}
            {o[props.property?.name || '']}
            {o.note && (
              <span className="font-normal ml-auto pl-3 text-xs opacity-70">{o.note}</span>
            )}
          </div>,
        );

        return memo;
      }, []),
    [props, value, set],
  ) as ReactNode[];

  return (
    <Container title={props.title}>
      <div
        className={twMerge(
          `
            border
            flex
            h-10
            items-center
            min-w-[50px]
            relative
            w-full
            bg-[color:--embeddable-controls-backgrounds-colors-soft]
            border-[color:--embeddable-controls-borders-colors-normal]
            rounded-[--embeddable-controls-borders-radius]
            `,
          props.className,
        )}
      >
        <input
          ref={ref}
          value={search}
          name="dropdown"
          placeholder={props.placeholder}
          onFocus={() => setFocus(true)}
          onBlur={() => setTriggerBlur(true)}
          onChange={(e) => performSearch(e.target.value)}
          className={`
            border-0
            cursor-pointer
            h-9
            leading-9
            outline-none
            px-3
            text-sm ${focus || !value ? '' : 'opacity-0'}
            w-full
            rounded-[--embeddable-controls-borders-radius]
            bg-[color:--embeddable-controls-backgrounds-colors-transparent]
          `}
        />

        {!!value && (
          <span
            className={`
              absolute
              block
              h-8
              leading-8
              left-3
              overflow-hidden
              pointer-events-none
              text-sm
              top-1
              truncate
              w-[calc(100%-2rem)]
              whitespace-nowrap
              bg-[color:--embeddable-controls-backgrounds-colors-soft]
              border-[color:--embeddable-controls-borders-colors-normal]
              rounded-[--embeddable-controls-borders-radius]
              ${focus ? 'hidden' : ''}
            `}
          >
            Selected {value.length} {value.length === 1 ? 'option' : 'options'}
          </span>
        )}

        {focus && (
          <div
            tabIndex={0}
            onBlur={() => setFocus(false)}
            style={{ minWidth: props.minDropdownWidth }}
            className={`
              absolute
              border
              flex
              flex-col
              max-h-[400px]
              overflow-x-hidden
              overflow-y-auto
              top-11
              w-full
              z-50
              bg-[color:--embeddable-controls-backgrounds-colors-soft]
              rounded-[--embeddable-controls-borders-radius]
            `}
            onMouseDown={(e) => {
              e.preventDefault();
              // re-focus the input (allows repeated clicking in and out)
              ref.current?.focus();
              setTriggerBlur(false);
            }}
          >
            {list}
            {list?.length === 0 && !!search && (
              <div className="px-3 py-2 text-black/50 italic cursor-pointer">No results</div>
            )}
          </div>
        )}

        {props.options.isLoading ? (
          <Spinner show className="absolute right-2 top-2 z-1 pointer-events-none" />
        ) : (
          <ChevronDown className="absolute right-2.5 top-2.5 z-1 pointer-events-none" />
        )}

        {!props.unclearable && !!value && (
          <div
            onClick={() => {
              set('');
            }}
            className="absolute right-10 top-0 h-10 flex items-center z-10 cursor-pointer"
          >
            <ClearIcon />
          </div>
        )}
      </div>
    </Container>
  );
};
