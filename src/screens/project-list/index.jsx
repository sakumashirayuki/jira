import { useState, useEffect } from "react";
import qs from "qs";

import { SearchPanel } from "./search-panel";
import { List } from "./list";

import { cleanObject } from "utils";

const apiUrl = process.env.REACT_APP_API_URL;

export const ProjectListScreen = () => {
  const [param, setParam] = useState({
    name: "",
    personId: "",
  });
  const [list, setList] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/projects?${qs.stringify(cleanObject(param))}`).then(async (response) => {
      if (response.ok) {
        setList(await response.json());
      }
    });
  }, [param]);

  useEffect(()=>{
    fetch(`${apiUrl}/users`).then(async (response) => {
        if(response.ok){
            setUsers(await response.json());
        }
    })
  }, []);

  return (
    <div>
      <SearchPanel
        param={param}
        setParam={setParam}
        users={users}
        setUsers={setUsers}
      />
      <List list={list} users={users}/>
    </div>
  );
};
