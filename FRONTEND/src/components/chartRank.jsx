import {Bar} from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Ranking () {
    return (
        <Bar
            data = {{
                labels: [
                    'Dai', 
                    'Bien', 
                    'Phi'
                ],
                datasets : [
                    {
                        label: 'Top những người uy tín',
                        borderRadius: 10,
                        backgroundColor : [
                            '#3e95cd',
                            '#8e5ea2',
                            '#3cba9f'
                        ],
                        data : [2500, 4000, 1000]
                    }
                ]
            }}

            options={{
                legend: { display: false},
                title: {
                    display: true,
                    text: 'Top nguoi choi trong ngay'
                }
                
            }}
            style={{height: '220px' }}
        />
    )
}

export default Ranking