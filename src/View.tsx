import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import fetch from 'cross-fetch';
import {Icon, TextField} from "@material-ui/core";

export interface Props {
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

export default function ( {id, structure} : Props) {
    const [company, changeCompany] = useState<Partial<Props>>({});
    const [isEdit, setEdit] = useState<boolean>(false);
    const [textStruct, setTextStruct] = useState<string>(structure.toString());

    useEffect(() => {
        (async () => {
            const response = await fetch('http://localhost:3000/api/companies/' + id/*, {
                method: 'PATCH',
                body: JSON.stringify({
                    'structure': structure
                }),
                'headers': {
                    'Content-type': 'application/json; charset=UTF-8'
                }
            }*/);
            if (response.ok) {
                changeCompany(await response.json());
            }
        })();
    }, []);

    const setProfitCenter = (profitCenter: undefined | boolean) => {
        let myprofitCenter = '';
        switch (profitCenter) {
            case true:
                myprofitCenter = 'Да';
                break;
            case false:
                myprofitCenter = 'Нет';
                break;
            default:
                myprofitCenter = '';
                break;
        }
        return myprofitCenter;
    }

    const setDate = (date: string | undefined) => {
        const convertDate = (inputFormat: string) => {
            function pad(s: number) {
                return (s < 10) ? '0' + s : s;
            }

            var d = new Date(inputFormat)
            return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('.')
        };
        let resDate = (date) ? convertDate(date) : '';
        return resDate;
    }

    const setStructure = (structure: undefined | Structure) => {
        let myStructure = '';
        switch (company.structure) {
            case 1:
                myStructure = 'ООО';
                break;
            case 2:
                myStructure = 'ИП';
                break;
            default:
                myStructure = (structure) ? structure.toString() : '';
                break;
        }
        return myStructure;
    }

    const saveStructure = () => {

        setEdit(false);
        (async () => {
            const response = await fetch('http://localhost:3000/api/companies/' + id, {
                method: 'PATCH',
                body: JSON.stringify({
                    'structure': (textStruct && !isNaN(Number(textStruct))) ? parseInt(textStruct) : structure
                }),
                'headers': {
                    'Content-type': 'application/json; charset=UTF-8'
                }
            }).then(response => response.json())
                .then(json => {
                    changeCompany(json);
                    setTextStruct((json?.structure) ? json.structure.toString() : '');
                })
        })();
    }

    return (
        <div>
            {(Object.keys(company).length) ?
                <div style={{textAlign: 'center', fontSize: 20}}>
                    <div><span style={{fontWeight: 600}}>Название компании</span> - {company.name}</div>
                    <div><span style={{fontWeight: 600}}>Профит-центр</span> - {setProfitCenter(company.profitCenter)}</div>
                    <div><span style={{fontWeight: 600}}>Дата создания</span> - {setDate(company.createdAt)}</div>
                    <div> {(!isEdit) ? <div>
                        <svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeSmall" focusable="false" viewBox="0 0 24 24"
                             aria-hidden="true" onClick={(event: any) => setEdit(true)} style={{cursor: 'Pointer'}}>
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg><span style={{fontWeight: 600}}>Структура</span> - {setStructure(structure)} </div>
                        : <div>
                            <Icon onClick={saveStructure} style={{cursor: 'Pointer'}}>save</Icon>
                            <TextField id="standard-basic" onChange={(event: any) => setTextStruct(event.target.value)} value={textStruct}/>
                        </div>}
                    </div>
                </div>: ''}
        </div>
    )
}