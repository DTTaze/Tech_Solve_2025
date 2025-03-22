import React from "react";
import classNames from 'classnames'

import {
    CCardFooter,
    CCol,
    CProgress,
    CRow
  } from '@coreui/react'


export const ChartFooter = () => {
    const progressExample = [
        { title: 'Visits', value: '29.703 Users', color: 'success' },
        { title: 'Unique', value: '24.093 Users',  color: 'info' },
        { title: 'Pageviews', value: '78.706 Views',  color: 'warning' },
        { title: 'New Users', value: '22.123 Users', color: 'danger' },
    ]

    return (
      <CCardFooter>
      <CRow
        xs={{ cols: 1, gutter: 4 }}
        sm={{ cols: 2 }}
        lg={{ cols: 3 }}
        xl={{ cols: 4 }}
        className="mb-2 text-center"
      >
        {progressExample.map((item, index, items) => (
          <CCol
            className={classNames({
              'd-none d-xl-block': index + 1 === items.length,
            })}
            style={{ minWidth: '150px' }}
            key={index}
          >
            <div className="text-body-secondary">{item.title}</div>
            <div className="fw-semibold">
              {item.value} 
            </div>
            <CProgress thin className="mt-2" color={item.color} value={'100%'} />
          </CCol>
        ))}
      </CRow>
    </CCardFooter>
    )
}