import s from './style.module.sass';
import User from '../../store/User';
import { useState, useMemo } from "react";
import { useNavigate }  from 'react-router-dom';
import { useTable, useGlobalFilter, useAsyncDebounce, useFilters } from "react-table";

//поиск поиск
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = useState(globalFilter)
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <div className={s.searchInput}>
      <span>
        Поиск:{' '}
      </span>
      <input
        value={value || ""}
        onChange={e => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} пунктов`}
      />
    </div>
  )
};

//фильтрация
export function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  const options = useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  return (
    <select
      name={id}
      id={id}
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">Все</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

//таблица
function Table({ columns, data, url }) {
  const navigate = useNavigate();
  const { 
    getTableProps, 
    getTableBodyProps, 
    headerGroups, 
    rows, 
    prepareRow,
    state,
    preGlobalFilteredRows,
    setGlobalFilter } =
    useTable({
      columns,
      data,
    }, useFilters, useGlobalFilter);
  return (
    <>
      <div className={s.searchBlock}>
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        <div className={s.searchSelect}>
          {headerGroups.map((headerGroup) =>
              headerGroup.headers.map((column) =>
                column.Filter ? (
                  <div key={column.id}>
                    <label htmlFor={column.id}>{column.render("Header")}: </label>
                    {column.render("Filter")}
                  </div>
                ) : null
              )
            )}
        </div>
      </div>
      <table {...getTableProps()} className={s.table}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                })}

                <td>
                  <button 
                    className={row.original.newOrder && User.premissions.isAdmin ? (s.new) : ''}
                    onClick={() => {navigate(`/${url}/${row.original.id}`)}}></button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default Table;