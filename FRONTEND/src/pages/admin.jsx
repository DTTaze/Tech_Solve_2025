import React from "react";
import '../styles/pages/admin.css'
import CustomizedBreadcrumbs from "../components/breadcrumb";
import { WidgetStatsAExample } from "../components/cards-widget";
import SimpleLineChart from "../components/chart-admin";
import {ChartFooter} from "../components/chart-footer";
import TemporaryDrawer from "../components/sidebar-admin";

function Admin () {
    return (
        <div className="admin-pages-container">
            <div className="breadcrumb-container">
                <div className="breadcrumb-item1">
                    <TemporaryDrawer/>
                </div>
                <div className="breadcrumb-item2">
                    <CustomizedBreadcrumbs/>
                </div>
            </div>
            <div className="card-grid-container">
                <WidgetStatsAExample/>
            </div>
            <div className="chart-container">
                <SimpleLineChart/>
                <div className="chart-footer">
                    <ChartFooter/>
                </div>
            </div> 

        </div>
    )
}

export default Admin