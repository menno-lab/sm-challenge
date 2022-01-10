import React from 'react';

interface IProps {
    people: {
      name: string
      age: number
      url: string
      note?: string
    }[]
  }

const List: React.FC<IProps> = ({ people }) => {

    const renderList = () => {
        return people.map((person) => {
            return (
                <li>
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