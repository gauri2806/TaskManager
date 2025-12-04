import React, { useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import TasksTable from "../components/TasksTable.jsx";
import VoiceInput from "../components/VoiceInput.jsx";

export default function Home() {
    return (
        <>
            <TasksTable />
        </>
    );
}
