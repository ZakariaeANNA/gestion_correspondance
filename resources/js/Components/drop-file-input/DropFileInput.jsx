import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import './drop-file-input.css';
import ClearIcon from '@mui/icons-material/Clear';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { ImageConfig } from '../../config/ImageConfig'; 
import uploadImg from '/images/cloud-upload-regular-240.png';
import { IconButton } from '@mui/material';

const DropFileInput = props => {

    const wrapperRef = useRef(null);

    const onDragEnter = () => wrapperRef.current.classList.add('dragover');

    const onDragLeave = () => wrapperRef.current.classList.remove('dragover');

    const onDrop = () => wrapperRef.current.classList.remove('dragover');

    const onFileDrop = (e) => {
        if (props.multiple === true) {
            var updatedList = [...props.files];
            for( var i = 0 ; i < e.target.files.length ; i++ ){
                updatedList = [...updatedList, e.target.files[i]];
            }
            props.setFiles(updatedList);
        }else{
            const newFile = e.target.files[0];
            props.setFiles([newFile]);
        }
    }

    const fileRemove = (file) => {
        if(props.multiple === true){
            const updatedList = [...props.files];
            updatedList.splice(props.files.indexOf(file), 1);
            props.setFiles(updatedList);
        }else{
            props.setFiles([]);
        }           
    }

    const { t } = useTranslation();
    const convertFileSize = (size) =>{
         var convertedSize = size+'B'
        if(size>1000){
            const kilo = size/1000
            convertedSize = kilo.toFixed(2)+"KB"
            if(kilo>1024){
               const mega = kilo/1024 
                convertedSize = mega.toFixed(2)+'MB'
            }
        }
        return convertedSize;
    }
    return (
        <>
            <div
                ref={wrapperRef}
                className="drop-file-input"
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                <div className="drop-file-input__label">
                    <img src={uploadImg} alt="" />
                    <p>{t('drag&drop')}</p>
                </div>
                <input type="file" value="" onChange={onFileDrop} multiple={props.multiple} />
            </div>
            {
                props.files.length > 0 ? (
                    <List disablePadding component={'div'}>
                            {
                                props.files.map((item,index)=>(
                                    <ListItem key={index}
                                        secondaryAction={
                                            <IconButton onClick={() => fileRemove(item)} edge="end">
                                                <ClearIcon/>
                                            </IconButton>
                                        }
                                    >
                                        <ListItemAvatar>
                                                <Avatar alt="" src={ImageConfig[item.type.split('/')[1]] || ImageConfig['default']} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={item.name}
                                            secondary={convertFileSize(item.size)}
                                        />
                                    </ListItem>
                                ))
                            }
                        </List>
                ) : null
            }
        </>
    );
}

DropFileInput.propTypes = {
    onFileChange: PropTypes.func
}

export default DropFileInput;
