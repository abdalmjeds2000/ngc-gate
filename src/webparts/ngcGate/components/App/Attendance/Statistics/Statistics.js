import React, { useContext, useEffect, useState } from 'react';
import './Statistics.css';
import { RadialBar, Column } from '@ant-design/plots';
import axios from 'axios';
import { AppCtx, apiUrl } from '../../App';
import CustomSelect from '../components/CustomSelect';
import AntdLoader from '../../Global/AntdLoader/AntdLoader';


function removeDuplicates(arr) {
  return arr?.filter((item,
      index) => arr.indexOf(item) === index);
}

function Statistics() {
  const { user_data, departments_info } = useContext(AppCtx)




  // Start Monthly Attendance Code
  const [monthlyAttendanceLoader, setMonthlyAttendanceLoader] = useState(true);
  const [monthlyYear, setMonthlyYear] = useState(new Date().toString().slice(4, 7) + ' ' + new Date().toString().slice(11, 15));
  const [monthlyAttendanceDates, setMonthlyAttendanceDates] = useState([]);
  useEffect(() => {
    const getDatesInRange = (startDate, endDate) => {
      const date = new Date(startDate.getTime());
      date.setDate(date.getDate() + 1);
      const dates = [];
      while (date < endDate) {
        dates.push(new Date(date).toString());
        date.setDate(date.getDate() + 1);
      }
      return dates;
    }
    var datesInRange = getDatesInRange(new Date('2018-01-01'), new Date()).map(d => {
      const month = d.slice(4, 7)
      const year = d.slice(11, 15)
      return month + ' ' + year
    })
    setMonthlyAttendanceDates(Array.from(new Set(datesInRange)))
  }, [])
  const returnNumberOfMonth = (month) => {
    if(month === 'Jan') return 1
    else if(month === 'Feb') return 2
    else if(month === 'Mar') return 3
    else if(month === 'Apr') return 4
    else if(month === 'May') return 5
    else if(month === 'Jun') return 6
    else if(month === 'Jul') return 7
    else if(month === 'Aug') return 8
    else if(month === 'Sep') return 9
    else if(month === 'Oct') return 10
    else if(month === 'Nov') return 11
    else if(month === 'Dec') return 12
  }
  useEffect(() => {
    fetchData();
  }, [monthlyYear, user_data])
  let [dataRadialBar, setDataRadialBar] = useState([
    {name: 'Annual Leave', star: 10,},
    {name: 'Working Days', star: 10,},
  ])
  const fetchData = () => {
    setMonthlyAttendanceLoader(true);
    if(Object.keys(user_data)?.length > 0) {
      axios({
        method: 'GET',
        url: `${apiUrl}/attendance/GetStatistics?email=${user_data.Data?.PIN}&Year=${new Date().getFullYear()}&Month=${(new Date().getMonth())+1}`
      }).then((res) => {
          setDataRadialBar([
            {name: 'Annual Leave', star: res.data?.Data[0]?.AnnualLeave},
            {name: 'Working Days', star: res.data?.Data[0]?.WorkingDays},
          ])
      }).then(() =>{
        setMonthlyAttendanceLoader(false);
      }).catch(err => console.log(err))
    }
  }
  const configRadialBar = {
    data: dataRadialBar,
    xField: 'name',
    yField: 'star',
    radius: 1,
    innerRadius: 0.5,
    tooltip: {
      formatter: (datum) => {
        return {
          name: datum.name,
          value: datum.star,
        };
      },
    },
    colorField: 'name',
    color: ({ name }) => {
      if (name === 'Working Days') {
        return '#50220E';
      } else if (name === 'Annual Leave') {
        return '#D59F29';
      }
      return '#50220E';
    },
    animation: {
      appear: {
        animation: 'none',
      },
    },
  };
  // End Monthly Attendance Code






  // Start Annual Attendance Code
  const currentYear = new Date().getFullYear();
  const years = (currentYear) => {
    let yearsToNow = []
    for(let i=2018; i <= currentYear; i++) {
      yearsToNow.push(i);
    }
    return yearsToNow;
  }
  const [annualAttendanceLoader, setAnnualAttendanceLoader] = useState(true);
  const [annualYear, setAnnualYear] = useState(currentYear);
  const [data, setData] = useState([]);
  useEffect(() => {
    setAnnualAttendanceLoader(true)
    if(Object.keys(user_data)?.length > 0) {
      axios({
        method: 'GET',
        url: `${apiUrl}/attendance/GetStatistics1?email=${user_data.Data?.PIN}&Year=${annualYear}&Month=1`
      }).then(res => {
        let NormalChartData = res.data?.Data?.map(e =>  {return{"Month": e.Month, "type": "Normal", "value": e.Status1}})
        let AbsentChartData = res.data?.Data?.map(e =>  {return{"Month": e.Month, "type": "Absent", "value": e.Status2}})
        let DelayLeaveChartData = res.data?.Data?.map(e =>  {return{"Month": e.Month, "type": "Delay & Early Leave", "value": e.Status3}})
        let BusinessTripChartData = res.data?.Data?.map(e =>  {return{"Month": e.Month, "type": "Leaves & Business Trip", "value": e.Status4}})
        setData([...NormalChartData, ...AbsentChartData, ...DelayLeaveChartData, ...BusinessTripChartData])
        setAnnualAttendanceLoader(false)
      }).catch(err => console.log(err))
    }
  }, [annualYear, user_data])
  const config = {
    data,
    xField: 'Month',
    yField: 'value',
    seriesField: 'type',
    isGroup: 'true',
    colorField: 'type',
    color: ({ type }) => {
      if (type === 'Normal') {
        return '#50220E';
      } else if (type === 'Absent') {
        return '#D32A2A';
      } else if (type === 'Delay & Early Leave') {
        return '#D59F29';
      } else if (type === 'Leaves & Business Trip') {
        return '#23cdb2';
      }
      return '#4096c4';
    },
    animation: {
      appear: {
        animation: 'none',
      },
    },
  };
  // End Annual Attendance Code








  // Start Employees Availability Attendance Code
  const [selectedDepartments, setSelectedDepartments] = useState('-1');
  const [selectedEmployee, setSelectedEmployee] = useState('-1');

    // update departments options
  const [departments, setDepartments] = useState([]);
  useEffect(() => {
    const filterDep = removeDuplicates(departments_info?.map(u => u.Department)?.filter(d => d.length > 0));
    setDepartments(filterDep)
  }, [user_data, departments_info])

    // update users options
  const [employees, setEmployees] = useState([]);
  useEffect(() => {
    const filterEmp = removeDuplicates(departments_info?.filter(e => e.Enabled && e.DisplayName.length > 0 && e.PIN !== '000000000').map(e => {return {value: e.PIN, name: e.DisplayName}}));
    const empInDep = removeDuplicates(departments_info?.filter(e => e.Enabled && e.DisplayName.length > 0 && e.PIN !== '000000000' && e.Department === selectedDepartments).map(e => {return {value: e.PIN, name: e.DisplayName}}));
    if(selectedDepartments === '-1') {
      setEmployees(filterEmp)
    } else {
      setEmployees(empInDep)
    }
    setSelectedEmployee('-1');
  }, [user_data, departments_info, selectedDepartments])

    // make request
  useEffect(() => {
    if(selectedEmployee === '-1') {
      setEmployeesAvailabilityData( [
        { type: 'Stick Leave', number: 0 },
        { type: 'Leave', number: 0 },
        { type: 'Trips', number: 0 },
        { type: 'Shortage', number: 0 },
        { type: 'Availabilities', number: 0 },
      ])
      const allIds = employees.map(u => u.value).join(',');
      axios({method: 'GET', url: `${apiUrl}/attendance/GetStatistics?email=${allIds}&Year=${currentYear}&Month=${(new Date().getMonth())+1}`})
      .then(res => {
        if(res?.data?.Data?.length > 0){
          const response = res?.data?.Data;
          for(let key in response) {
            const getDataNeeded = [
              response[key]?.SickLeave,
              response[key]?.AnnualLeave,
              response[key]?.BusinessTrip,
              response[key]?.TotalShortage,
              response[key]?.WorkingDays
            ]
            setEmployeesAvailabilityData(prev => {
              prev[0].number += getDataNeeded[0]
              prev[1].number += getDataNeeded[1]
              prev[2].number += getDataNeeded[2]
              prev[3].number += getDataNeeded[3]
              prev[4].number += getDataNeeded[4]
              return [...prev]
            })
          }
        }
      })
    } else {
      axios({
        method: 'GET',
        url: `${apiUrl}/attendance/GetStatistics?email=${selectedEmployee}&Year=${currentYear}&Month=${(new Date().getMonth())+1}`
      })
      .then(res => {
        const response = res?.data?.Data[0];
        const getDataNeeded = [
          { type: 'Stick Leave', number: response?.SickLeave },
          { type: 'Leave', number: response?.AnnualLeave },
          { type: 'Trips', number: response?.BusinessTrip },
          { type: 'Shortage', number: response?.TotalShortage },
          { type: 'Availabilities', number: response?.WorkingDays },
        ]
        setEmployeesAvailabilityData(getDataNeeded)
      })
    }
  }, [selectedEmployee, employees])

  const [employeesAvailabilityData, setEmployeesAvailabilityData] = useState([]);
  const employeesAvailabilityConfig = {
    data: employeesAvailabilityData,
    xField: 'type',
    yField: 'number',
    // height: 320,
    columnWidthRatio: 0.7,
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    color: ({ type }) => {
      if (type === 'Sick Leave') {
        return '#D59F29';
      } else if (type === 'Leave') {
        return '#E98EAD';
      } else if (type === 'Trips') {
        return '#4096c4';
      } else if (type === 'Shortage') {
        return '#23cdb2';
      } else if (type === 'Availabilities') {
        return '#4F55C2';
      }
      return '#D59F29';
    },
    animation: {
      appear: {
        animation: 'none',
      },
    },
  }
  // End Employees Availability Attendance Code



  return (
    <div className='statistics-container'>
      <div className='monthly-attendance'>
        <div className="head">
          <h3>Monthly Attendance</h3>
          <select name="monthlyYear" onChange={(e) => setMonthlyYear(e.target.value)}>
            {
              monthlyAttendanceDates.map((date, i) => {
                return <option selected={i === monthlyAttendanceDates?.length-1 ? true : false} value={date} key={i}>{date}</option>
              })
            }
          </select>
        </div>
        <div className="body">
          <div className='index'>
            <span>Working Days</span>
            <span>Annual Leave</span>
          </div>
          <div className='radialBar' style={{ display: monthlyAttendanceLoader ? 'none' : '' }}>
            <RadialBar 
              {...configRadialBar}
              style={{
                width: '100%',
                margin: '20px 0 40px 0',
              }} 
            />
          </div>
          {monthlyAttendanceLoader && <AntdLoader />}
        </div>
      </div>

      <div className='annual-attendance'>
        <div className="head">
          <h3>Annual Attendance</h3>
          <select name="date" onChange={(e) => setAnnualYear(e.target.value)}>
            {
              years(currentYear).map((year, i) => {
                return (
                  <option 
                    selected={year === currentYear ? true : false} 
                    value={year} 
                    key={i}
                  >
                    {year}
                  </option>
                )
              })
            }
          </select>
        </div>
        {!annualAttendanceLoader ? <Column {...config} /> : <AntdLoader />}
      </div>

      <div className='employees-availability-attendance'>
        <div style={{ display: 'flex', gap: 25, justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: 25 }}>
          <div className="head">
            <h3>Employees Availability Attendance</h3>
            <p>NGC Employees Ava.</p>
          </div>
          <div className="body">
            <div className="buttons">
              <CustomSelect 
                name='byOrganization' 
                options={[
                  {value: 'NGC', name: 'NGC'},
                ]}
              />
              <CustomSelect 
                name='byDepartment' 
                options={[
                  {value: '-1', name: 'All'},
                  ...departments.map(d => {return {value: d, name: d}}),
                ]}
                onChange={(e) => setSelectedDepartments(e.target.value)}
              />
              <CustomSelect 
                name='byEmployees' 
                options={[
                  {value: '-1', name: 'All'},
                  ...employees
                ]}
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className='column-chart-container'>
          <Column {...employeesAvailabilityConfig} style={{width: '100%'}} />
          <div className="index">
            <ul>
              <li><p>Sick Leave</p></li>
              <li><p>Leave</p></li>
              <li><p>Trips</p></li>
              <li><p>Shortages</p></li>
              <li><p>Availabilities</p></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Statistics