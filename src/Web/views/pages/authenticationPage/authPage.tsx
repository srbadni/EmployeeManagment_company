import React, {Fragment, useEffect} from 'react';
import {useParams} from "react-router-dom";
import StorageService from "../../../../service/storage.service";
import axios from "axios";

const AuthPage = () => {
    let {tokenId} = useParams();
    useEffect(() => {
        (async function () {
            // @ts-ignore
            const {data} = await axios.get(`${BASE_URL_COMPANY}/users/check-user`, {
                headers: {
                    authorization: `Bearer ${tokenId}`
                }
            })

            if (!StorageService.getToken()) {
                StorageService.setToken(tokenId)
                data && StorageService.setName(data.companyName)
            } else {
                StorageService.removeToken()
                StorageService.removeName()
                StorageService.setToken(tokenId)
                data && StorageService.setName(data.companyName)
            }
            window.location.href = "/"
        })()
    }, [tokenId])

    return (
        <Fragment>

        </Fragment>
    );
};

export default AuthPage;
