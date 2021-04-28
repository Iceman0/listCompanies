import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import fetch from 'cross-fetch';
import View from "./View";

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
              lookup: { true: 'Да', false: 'Нет' },
              //customFilterAndSearch: (term, rowData) => rowData.profitCenter.toString().indexOf(term) > -1 //для поиска false
            },
            {
              title: 'Дата создания',
              type: 'date',
              field: 'createdAt',
            },
          ]}
          title="Компании"
          options={{
            filtering: true,
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
          detailPanel={[
            {
              tooltip: 'Показать информцию о компании',
              render: rowData => {
                return (
                    <View {...rowData}/>
                )
              },
            }
          ]}
      />
  );
}


