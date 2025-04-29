import { CreateButton, FilterDropdown, List ,   DeleteButton,  EditButton} from '@refinedev/antd'
import { getDefaultFilter, useGo,HttpError } from '@refinedev/core'
import React from 'react'
import { Input, Table } from 'antd'
import { useTable } from '@refinedev/antd'
import { COMPANIES_LIST_QUERY } from '@/graphql/queries'
import { SearchOutlined } from '@ant-design/icons'
import CustomAvatar from '@/components/custom-avatar'
import {Space} from 'antd'
import { Text } from '@/components/text'
import { Company } from '@/graphql/schema.types'
import { currencyNumber } from "@/utilities";

const CompanyList = ({children}:React.PropsWithChildren) => {

  const go = useGo();
  const { tableProps, filters } = useTable<Company, HttpError, Company>({
    resource: "companies",
    onSearch: (values) => {
      return [
        {
          field: "name",
          operator: "contains",
          value: values.name,
        },
      ];
    },
    sorters: {
      initial: [
        {
          field: "createdAt",
          order: "desc",
        },
      ],
    },
    filters: {
      initial: [
        {
          field: "name",
          operator: "contains",
          value: undefined,
        },
      ],
    },
    pagination: {
      pageSize: 12,
    },
    meta: {
      gqlQuery: COMPANIES_LIST_QUERY,
    },
  });

  return  (
    <div>
    <List
    breadcrumb={false}
    headerButtons={()=>(<CreateButton
    onClick={()=> {
      go({
        to:{
          resource:'companies',
          action:'create'
        },
        options:{keepQuery:true},
        type:'replace',
      })
    }}
    />)}
    >
      <Table
      {...tableProps}
      pagination={{
        ...tableProps.pagination,
      }}
      >
        <Table.Column 
          dataIndex="name"
          title='company title'
          defaultFilteredValue={getDefaultFilter('id',filters)}
          filterIcon={<SearchOutlined/>}
          filterDropdown={(props)=>(
            <FilterDropdown {...props}>
                <Input placeholder='search copmany ...'/>
            </FilterDropdown>
          )}
          render={(_, record) => {
            return (
              <Space>
                <CustomAvatar
                  shape="square"
                  name={record.name}
                  src={record.avatarUrl}
                />
                <Text
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  {record.name}
                </Text>
              </Space>
            );
          }}
        />
          <Table.Column<Company>
            dataIndex={"totalRevenue"}
            title="Open deals amount"
            render={(_, company) => {
              return (
                <Text>
                  {currencyNumber(company?.dealsAggregate?.[0].sum?.value || 0)}
                </Text>
              );
            }}
          />
            <Table.Column<Company>
            fixed="right"
            dataIndex="id"
            title="Actions"
            render={(value) => (
              <Space>
                <EditButton hideText size="small" recordItemId={value} />

                <DeleteButton hideText size="small" recordItemId={value} />
              </Space>
            )}
          />
      </Table>
    </List>
    {children}
    </div>
  )
}

export default CompanyList
