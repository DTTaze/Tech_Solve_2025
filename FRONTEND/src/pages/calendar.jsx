import React, { useState } from 'react'
import dayjs from 'dayjs'
import range from "lodash-es/range"
import './calendar.scss'

const weekDays = ['Sun','Mon', 'Tue', 'Wed', 'Thus', 'Fri', 'Sat']
const todayObj = dayjs()

const Calenda = () =>{
    const [dayObj, setdayobj] = useState(dayjs())
    const thisYear = dayObj.year()
    const thisMonth = dayObj.month()
    const daysInMonth = dayObj.daysInMonth()

    const dayObjOf1 = dayjs(`${thisYear}-${thisMonth+1}-1`)
    const weekDayObjOf1 = dayObjOf1.day()

    const dayObjOfLast = dayjs(`${thisYear}-${thisMonth+1}-${daysInMonth}`)
    const weekDayObjOfLast = dayObjOfLast.day()
    

    const handlePrev = () => {
        setdayobj(dayObj.subtract(1, 'month'))
    }

    const handleNext = () => {
        setdayobj(dayObj.add(1, 'month'))
    }
    return (
        <div className='calenda'>
            <div className='header_calendar'>
                <button type = 'button' className='nav nav--prev' onClick={handlePrev}>
                    &lt;
                </button>
                <div className='datetime' >{dayObj.format('MMM DD YYYY')}</div>
                <button type='button' className='nav nav--prev' onClick={handleNext}>
                    &gt;
                </button>
            </div>
            <div className='week-container'>
                {weekDays.map(d => (
                    <div className='week-cell' key={d}>
                        {d}
                    </div>
                ))}
            </div>
            <div className='day-container'>
                {range(weekDayObjOf1).map(i => (
                    <div className='day-cell day-cell--faded' key = {i}>
                        {dayObjOf1.subtract(weekDayObjOf1 - i, 'day').date()}
                    </div>
                ))
                }

                {range(daysInMonth).map(i => (
                <div
                    className={`day-cell day-cell--in-month${
                    i + 1 === todayObj.date() &&
                    thisMonth === todayObj.month() &&
                    thisYear === todayObj.year()
                        ? " day-cell--today"
                        : ""
                    }`}
                    key={i}
                >
                    {i + 1}
                </div>
                ))}

                {range(6 - weekDayObjOfLast).map(i => (
                    <div className='day-cell day-cell--faded' key = {i}>
                        {dayObjOfLast.add(i+1, 'day').date()}
                    </div>
                ))}
            </div>  
        </div>
    )
}

export default Calenda