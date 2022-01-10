import React from 'react';
import { IState as IProps } from "../App";


const List: React.FC<IProps> = ({ people }) => {

    const renderList = () => {
        return people.map((person) => {
            return (
                <li key={person.name}>
                <div>
                    <h2>{person.name}</h2>
                    <img src={person.url} alt="pic" height="200" />
                </div>
                <p>{person.age} years old</p>
                <p>{person.note}</p>
                </li>
                )
            }
        )
    }

    return (
        <ul>
           {renderList()}
        </ul>
    )
}

export default List