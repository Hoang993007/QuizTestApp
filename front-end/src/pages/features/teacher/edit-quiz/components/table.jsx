import { collection, getDocs, query, where, updateDoc, doc, getDoc, deleteDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { DbsName } from 'src/constants/db';
import { db } from 'src/firebase/firebase';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import '../index.scss';
import TextareaAutosize from 'react-textarea-autosize';
import { NOTIFICATION_TYPE, openCustomNotificationWithIcon } from 'src/components/notification';
import { AiFillDelete } from "react-icons/ai";

const Table = ({ rows }) => {
    const [data, setData] = useState(rows); // Copy rows to the state

    const QuestionDelete = (idQ, index) => {
        const newData = [...data.slice(0, index), ...data.slice(index + 1)];
        setData(newData);
    };

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th rowSpan={2} className="col-No">
                            No.
                        </th>
                        <th rowSpan={2} className="col-Question">
                            Questions
                        </th>
                        <th colSpan={4} className="col-Answer">Answers</th>
                        <th rowSpan={2} className="col-Corect-Answer">
                            Correct Answer
                        </th>
                        <th rowSpan={2} className="col-delete"></th>
                    </tr>
                    <tr>
                        <th className="col-Answer">1</th>
                        <th className="col-Answer">2</th>
                        <th className="col-Answer">3</th>
                        <th className="col-Answer">4</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((val, key) => {
                        return (
                            <tr key={key}>
                                <td>{key + 1}</td>
                                <td>
                                    <TextareaAutosize
                                        defaultValue={val.Question}
                                        onChange={(e) => {
                                            val.Question = e.target.value;
                                            val.Edit = '1';
                                            setData([...data]);
                                        }}
                                    />
                                </td>
                                <td>
                                    <TextareaAutosize
                                        defaultValue={val.Answer1}
                                        onChange={(e) => {
                                            val.Answer1 = e.target.value;
                                            val.Edit = '1';
                                            setData([...data]);
                                        }}
                                    />
                                </td>
                                <td>
                                    <TextareaAutosize
                                        defaultValue={val.Answer2}
                                        onChange={(e) => {
                                            val.Answer2 = e.target.value;
                                            val.Edit = '1';
                                            setData([...data]);
                                        }}
                                    />
                                </td>
                                <td>
                                    <TextareaAutosize
                                        defaultValue={val.Answer3}
                                        onChange={(e) => {
                                            val.Answer3 = e.target.value;
                                            val.Edit = '1';
                                            setData([...data]);
                                        }}
                                    />
                                </td>
                                <td>
                                    <TextareaAutosize
                                        defaultValue={val.Answer4}
                                        onChange={(e) => {
                                            val.Answer4 = e.target.value;
                                            val.Edit = '1';
                                            setData([...data]);
                                        }}
                                    />
                                </td>
                                <td>
                                    <TextareaAutosize
                                        defaultValue={val.CorrectAnswer}
                                        onChange={(e) => {
                                            val.CorrectAnswer = e.target.value;
                                            val.Edit = '1';
                                            setData([...data]);
                                        }}
                                    />
                                </td>
                                <td><a id="btn-delete" data-id={val.Id} onClick={() => QuestionDelete(val.Id, key)}><AiFillDelete color="red" /></a></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    );
};
export default Table;