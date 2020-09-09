import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import fetch from 'cross-fetch';

interface Company {
  id: string;
  createdAt: string;
  profitCenter: boolean;
  name: string;
  structure: Structure;
}

enum Structure {
  IP = 1,
  OOO = 2,
}

export default function () {
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    (async () => {
      const response = await fetch('/api/companies/');
      if (response.ok) {
        setCompanies(await response.json());
      }
    })();
  }, []);

  return (
    <MaterialTable
      data={companies}
      columns={[
        {
          title: 'Название компании',
          field: 'name',
        },
        {
          title: 'Профит-центр',
          field: 'profitCenter',
        },
        {
          title: 'Дата создания',
          type: 'date',
          field: 'createdAt',
        },
      ]}
      title="Компании"
      options={{
        initialPage: 0,
        pageSize: 10,
        actionsColumnIndex: -1,
        search: false,
        draggable: false,
      }}
      localization={{
        pagination: {
          labelRowsSelect: 'строк',
        },
        header: {
          actions: '',
        },
        body: {
          emptyDataSourceMessage: 'Нет результатов',
        },
      }}
    />
  );
}
