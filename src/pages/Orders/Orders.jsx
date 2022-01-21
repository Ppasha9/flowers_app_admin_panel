import React, { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { makeStyles } from '@material-ui/core/styles';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import List from './List/List';
import StoreApi from './store/storeApi';
import InputContainer from './Input/InputContainer';
import { ClipLoader } from 'react-spinners';

import OrdersRequestsHandler from './OrdersRequestsHandler';
import {Link} from "react-router-dom";

const useStyle = makeStyles((theme) => ({
    root: {
        minHeight: '100vh',
        width: '100%',
        overflowY: 'auto',
    },
    listContainer: {
        display: 'flex',
    },
}));

export default function Orders() {
    const [isFetching, setIsFetching] = useState(true);
    const [data, setData] = useState({});

    const classes = useStyle();

    useEffect(() => {
        OrdersRequestsHandler.getAllCardsWithColumns().then((res) => {
            var dataToSet = { lists: {}, listIds: [] };
            res["columns"].forEach((columnName, idx) => {
                dataToSet.lists[columnName] = {
                    id: columnName,
                    title: columnName,
                    cards: []
                };
                res["cards"].forEach((cardInfo, cIdx) => {
                    if (cardInfo["columnName"] === columnName) {
                        dataToSet.lists[columnName].cards.push(cardInfo["order"])
                    }
                });
                dataToSet.listIds = [...dataToSet.listIds, columnName]
            });
            setData(dataToSet);
            setIsFetching(false);
        });
    }, [])

    const addMoreList = (title) => {
        try {
            OrdersRequestsHandler.createNewOrderColumn({"name": title.toString()}).then(() => {
                const newList = {
                    id: title,
                    title,
                    cards: [],
                };
                const newState = {
                    listIds: [...data.listIds, title],
                    lists: {
                        ...data.lists,
                        [title]: newList,
                    },
                };
                setData(newState);
            })
        } catch(e) {
            alert("Возникла ошибка при создании новой колонки")
        }
    };

    const updateListTitle = (title, listId) => {
        const list = data.lists[listId];
        list.title = title;

        const newState = {
            ...data,
            lists: {
                ...data.lists,
                [listId]: list,
            },
        };
        setData(newState);
    };

    const onDragEnd = (result) => {
        const { destination, source, draggableId, type } = result;
        console.log('destination', destination, 'source', source, draggableId);

        if (!destination) {
            return;
        }
        if (type === 'list') {
            const newListIds = data.listIds;
            newListIds.splice(source.index, 1);
            newListIds.splice(destination.index, 0, draggableId);
            return;
        }

        const sourceList = data.lists[source.droppableId];
        const destinationList = data.lists[destination.droppableId];
        const draggingCard = sourceList.cards.filter(
            (card) => card.id === draggableId
        )[0];

        if (source.droppableId === destination.droppableId) {
            sourceList.cards.splice(source.index, 1);
            destinationList.cards.splice(destination.index, 0, draggingCard);
            const newSate = {
                ...data,
                lists: {
                    ...data.lists,
                    [sourceList.id]: destinationList,
                },
            };
            setData(newSate);
        } else {
            sourceList.cards.splice(source.index, 1);
            destinationList.cards.splice(destination.index, 0, draggingCard);

            const newState = {
                ...data,
                lists: {
                    ...data.lists,
                    [sourceList.id]: sourceList,
                    [destinationList.id]: destinationList,
                },
            };
            setData(newState);
        }
    };

    if (isFetching) {
        return (
            <div className="container">
                <ClipLoader loading={isFetching} />
            </div>
        );
    }

    return (
        <div>
            <div className="row">
                <div className="col">
                    <h2 className="page-header">
                        Заказы
                    </h2>
                </div>
                <div className="col">
                    <div className="d-flex justify-content-end">
                        <Link to={{pathname: "/new_order"}}>
                            <button type="submit" className="btn btn-primary btn-lg">Новый заказ</button>
                        </Link>
                    </div>
                </div>
            </div>
            <StoreApi.Provider value={{ addMoreList, updateListTitle }}>
                <div
                    className={classes.root}
                    style={{
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="app" type="list" direction="horizontal">
                            {(provided) => (
                                <div
                                    className={classes.listContainer}
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    {data.listIds.map((listId, index) => {
                                        const list = data.lists[listId];
                                        return <List list={list} key={listId} index={index} />;
                                    })}
                                    <InputContainer type="list" />
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            </StoreApi.Provider>
        </div>
    );
}