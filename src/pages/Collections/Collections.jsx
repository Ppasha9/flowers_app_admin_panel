import React, {useEffect, useState} from "react"
import {ClipLoader} from "react-spinners";
import CompilationsRequestsHandler from "./CompilationsRequestsHandler";
import {Link, Redirect} from "react-router-dom";
import Table from "../../components/table/Table";

const customerTableHead = [
    'Превью',
    'Название',
]

const renderHead = (item, index) => <th key={index}>{item}</th>

const renderBody = (setCompilationIdToRedirect, item, index) => (
    <tr key={index} onClick={() => { setCompilationIdToRedirect(item.id); }}>
        <td style={{ width: "25%" }}><img src={item.picUrl} alt={``} className="img-fluid img-thumbnail" style={{ margin: "0 !important", padding: "0 !important", width: "auto", height: "auto" }} /></td>
        <td>{item.name}</td>
    </tr>
)

const Collections = () => {
    const [isFetching, setIsFetching] = useState(true);
    const [compilations, setCompilations] = useState([]);
    const [compilationIdToRedirect, setCompilationIdToRedirect] = useState(-1)

    useEffect(() => {
        try {
            CompilationsRequestsHandler.getAllCompilationsCuttedForms().then((res) => {
                setCompilations(res);
                console.log("Fetched compilations: ", compilations);
                setIsFetching(false);
            });
        } catch (error) {
            alert("Произошла ошибка при получении всех подборок.");
        }
    }, []);

    if (isFetching) {
        return (
            <div className="container">
                <ClipLoader loading={isFetching} />
            </div>
        );
    }

    /*
    if (compilationIdToRedirect !== -1) {
        return (
            <Redirect to={`/edit_compilation/${compilationIdToRedirect}`} />
        );
    }
     */

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <h2 className="page-header">
                        Подборки
                    </h2>
                </div>
                <div className="col">
                    <div className="d-flex justify-content-end">
                        <Link to="/new_compilation">
                            <button type="submit" className="btn btn-primary btn-lg">Добавить</button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="card">
                        <div className="card__body">
                            <Table
                                limit='10'
                                headData={customerTableHead}
                                renderHead={(item, index) => renderHead(item, index)}
                                bodyData={compilations}
                                renderBody={(item, index) => renderBody(setCompilationIdToRedirect, item, index)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Collections;