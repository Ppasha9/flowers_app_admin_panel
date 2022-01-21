import React, { useState } from 'react';
import { Paper, Typography, Collapse } from '@material-ui/core';
import { makeStyles, fade } from '@material-ui/core/styles';

import InputCard from './InputCard';
import {Link, Redirect} from "react-router-dom";

const useStyle = makeStyles((theme) => ({
    root: {
        width: '300px',
        marginTop: theme.spacing(1),
    },
    addCard: {
        padding: theme.spacing(1, 1, 1, 2),
        margin: theme.spacing(0, 1, 1, 1),
        background: '#EBECF0',
        '&:hover': {
            backgroundColor: fade('#000', 0.25),
        },
    },
}));

export default function InputContainer({ listId, type }) {
    const classes = useStyle();
    const [open, setOpen] = useState(false);
    const [redirect, setRedirect] = useState(false);
    return (
        <div className={classes.root}>
            <Collapse in={open}>
                <InputCard setOpen={setOpen} />
            </Collapse>
            <Collapse in={!open}>
                <Paper
                    className={classes.addCard}
                    elevation={0}
                    onClick={() => {
                        if (type !== 'card') {
                            setOpen(!open)
                        } else {
                            setRedirect(true)
                        }
                    }}
                >
                    {redirect && <Redirect to={{pathname: "/new_order", state: listId}}  />}
                    <Typography>
                        {type === 'card' ? '+ Новый заказ' : '+ Новая колонка'}
                    </Typography>
                </Paper>
            </Collapse>
        </div>
    );
}
