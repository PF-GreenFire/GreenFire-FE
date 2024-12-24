import React from 'react';
import { Table as BootstrapTable } from 'react-bootstrap';

const BasicTable = ({ headers, rows, onRowClick }) => {
    return (
        <BootstrapTable hover className="table px-5 mt-4">
            <thead className="border-2 border-bottom border-top border-secondary-subtle border-start-0 border-end-0">
            <tr>
                {headers.map((header, index) => (
                    <th key={index}>{header}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {rows.map((row, index) => (
                <tr key={index} onClick={() => onRowClick && onRowClick(row)}>
                    {Object.values(row).map((cell, cellIndex) => (
                        <td key={cellIndex}>{cell}</td>
                    ))}
                </tr>
            ))}
            </tbody>
        </BootstrapTable>
    );
};

export default BasicTable;