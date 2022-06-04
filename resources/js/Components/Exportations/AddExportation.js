import React,{useEffect,useState} from 'react';
import { useAddExportationsMutation } from "../../store/api/exportationApi";
import { useRefreshMutation } from "../../store/api/authApi";
import { useGetDepartmentsQuery } from "../../store/api/departmentApi";
import { useGetEstablishmentsQuery } from '../../store/api/establishementApi';
import { Button, TextField , Paper , Typography , CircularProgress } from "@mui/material";
import { Send } from "@mui/icons-material";
import { useSnackbar } from 'notistack';
import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';
import DropFileInput from '../drop-file-input/DropFileInput';
import LoadingButton from '@mui/lab/LoadingButton';
import { useSelector } from 'react-redux';
import i18next from 'i18next';
import Autocomplete from '@mui/material/Autocomplete';


const departmentWorkers = [ 
    { id : "chefDep" , nomar : "رئيس المصلحة" , nomla : "Chef de département" },
    { id : "tous" , nomar : "كل الموظفين" , nomla : "Tous les employés" }
]

export default function AddExportation(){
    const [dateAchevement,setDateAchevement] = useState() //la date achevement selectioné par l'utilisateur
    const [ departments , setDepartments ] = useState([]); // liste des departements existe dans la base de données
    const [ establishment , setEstablishment ] = useState([]); // liste des etablissements existe dans la base de données
    const [ dep , setDep ] = useState([]); // id departement ajouté par utilisateur
    const [ depWorkers , setDepWorkers ] = useState(null); // les employés du departement choisi
    const [ eta , setEta ] = useState([]); // codegresa de l'etablissement ajouté par l'utilisateur
    const [ files , setFiles ] = useState([]); // fichier saisie par l'utilisateur ( pdf , image )
    const [ tags , setTags ] = React.useState([]); // les doti saisie par l'utilisateur 
    const [ addExportations, { data, isLoading, error, isError, isSuccess }] = useAddExportationsMutation(); // la fonction qui envoi l'exportation vers backend avec les messages d'erreurs et de succès
    const [ refresh ] = useRefreshMutation(); // la fonction refresh qui est responsable à actualiser JWT token pour l'utilisateur 
    const { enqueueSnackbar } = useSnackbar(); // enqueueSnackbar pour afficher les messages flottants après effectuant une action
    const { t } = useTranslation(); // useTranslation qui est responsable à traduire la page selon la langue demandé
    const user = useSelector( state => state.auth.user ); // on a utilisé useSelector pour avoir les données d'utilisateur à partir de la fonction dispatch de redux
    const { data : dataDep , isLoading : isLoadingDep , error : errorDep , isError : isErrorDep , isSuccess : isSuccessDep } = useGetDepartmentsQuery(); // getdepartments responsable à recevoir tous les departements existe dans le systeme
    const { data : dataEsta , isLoading : isLoadingEsta , error : errorEsta , isError : isErrorEsta , isSuccess : isSuccessEsta } = useGetEstablishmentsQuery(); // get etablishments responsable à recevoir tous les etablissemnts existe dans la base de données
    const auth = useSelector( state => state.auth.user );

    // la fonction removeTags pour supprimer un doti existe par l'utilisateur
    const removeTags = indexToRemove => { 
		setTags([...tags.filter((_, index) => index !== indexToRemove)]);
	};
    useEffect(()=>{
        // Si la requete est effectue avec succès on peut afficher un message de succès
        if(isSuccess){
            enqueueSnackbar( t('correspondence_success_send') ,  { variant: "success" });
        }
        //Sinon on va afficher un message d'erreur selon l'erreur recu
        if(isError){
            if(error.data === "correspondence_add/user_not_found"){
                enqueueSnackbar( t('correspondence_send_user_not_found') ,  { variant: "error" });
            }else if(error.data === "correspondence_add/informations_incorrects"){
                enqueueSnackbar( t('correspondence_informations_incorrects') ,  { variant: "error" });
            }else if(error.data[0]==="correspondance_add/fields_required"){
                enqueueSnackbar( t('correspondance_add/fields_required') , { variant: "error" });
            }
        }
        // si les données d'etablissements ont recus avec succès on peut les sauvegarder dans une state
        if(dataEsta){
            setEstablishment(dataEsta);
            setEstablishment((prev) => [   
                { codegresa : "all" , nomar : "جميع المدارس" , nomla : "Tous les établissments" , delegation : "tetouan" , type : "administrative" }    ,
                { codegresa:"primaire", nomar : "مدارس التعليم الابتدائي" , nomla : "Ecoles primaires" , delegation : "tetouan" },
                { codegresa:"college", nomar : "مدارس التعليم الاعدادي" , nomla : "Ecoles colleges" , delegation : "tetouan" },
                { codegresa:"lycee", nomar : "مدارس التعليم الثانوي" , nomla : "Ecoles lycee" , delegation : "tetouan" },
                ...prev   
            ]);
        }
        // si les données des departements ont recus avec succèes on peut les sauvegarder dans state 
        if(dataDep){
            setDepartments(dataDep.data);
            if(auth.role !== "directeur")
                setDepartments((prev) => [  
                    { id:"all", nomAr : "جميع المصالح" , nomLa : "Tous les departements" , delegation : "tetouan" },
                    ...prev          
                ]);
        }
    },[data,isError,isSuccessDep,isSuccessEsta]); // les données qui actualiser components
    function getCodegresaArray(value){
        const codegresaArray = []
        value?.map(item=> codegresaArray.push(item.codegresa));
        return codegresaArray;
    }
    function getidArray(value){
        const idsArray = []
        value?.map(item=> idsArray.push(item.id));
        return idsArray;
    }
    // la fonction addTags qui permet d'ajouter les doti saisie par l'utilisateur dans state
    const addTags = event => {
        if (event.key === " " && event.target.value !== "") {
            setTags([...tags, { idReceiver : event.target.value.replace(/\s+/g, '') } ]);
            event.target.value = "";
        }
    }

    // la fonctions qui permet d'envoyer l'exportation vers backend
    const onAddExportations = async(event) => {
        event.preventDefault();
        if(dateAchevement && new Date(dateAchevement) > new Date()){
            const formData = new FormData(event.currentTarget);
            if(!eta?.length && !tags?.length && !dep?.length){
                enqueueSnackbar( t('receiver_required') , { variant: "error" });
                return;
            }
        
            if(dep?.length && !depWorkers){
                enqueueSnackbar( t('receiver_type_required') , { variant: "error" });
                return;
            }
            if(tags?.length)formData.append('receiver', JSON.stringify(tags));
            if(dep?.length && depWorkers){
                formData.append('depRoles',depWorkers.id);
                formData.append('department',getidArray(dep));
            }
            if(eta) formData.append('codegresa',getCodegresaArray(eta));
            formData.append('sender',user.doti);
            formData.append('file', files[0]);
            try{
                await addExportations(formData).unwrap();
            }catch(error){
                if(error.status === 401){
                    await refresh({ token : localStorage.getItem("token") }).unwrap().then( data => {
                        localStorage.setItem( "token",data);
                        addExportations(formData);
                    });
                }
            }
            setFiles([]); setTags([]); event.target.reset(); setDep(null); setEta(null); // pour supprimer tous les données saisies après l'envoi
        }else{
            enqueueSnackbar(t('achevement_date_error') ,  { variant: "error" });
        }
    }
    return (
        <React.Fragment>
            <Box sx={{display: 'flex',flexDirection: 'row',justifyContent: 'flex-start',paddingBottom:2,alignItems:"center"}}>
                <Typography variant='h6' sx={{fontSize:25 , fontWeight:"bold"}}>{t("sendExportation")}</Typography>
            </Box>
            { isLoadingDep || isLoadingEsta ? (
                <Box
                    sx={{
                        position : "absolute",
                        top : "50%",
                        right : "50%",
                        background : "transparent"
                    }}
                >
                    <CircularProgress/>
                </Box>
            ):(
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <form onSubmit={onAddExportations} encType="multipart/form-data">
                        <div className="tags-input">
                            <ul id="tags">
                                {tags.map((tag, index) => (
                                    <li key={index} className="tag">
                                        <span className='tag-title'>{tag.idReceiver}</span>
                                        <span className='tag-close-icon'
                                            onClick={() => removeTags(index)}
                                        >
                                            x
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <input
                                type="text"
                                onKeyDown={event => event.key === " " ? addTags(event) : null}
                                placeholder={t("doti")}
                                style={{ fontSize : "1rem" , paddingTop : 2 , paddingBottom : 2}}
                            />
                        </div>
                        <Box sx={{ display : "flex" , marginBottom : 1 , marginTop : 2  }}>
                            { auth.role != "directeur" ? (
                                <Autocomplete
                                    multiple={true}
                                    value={eta!==null ? eta : []}
                                    autoHighlight
                                    onChange={(e,v) =>{setEta(v)}}
                                    id="combo-box-demo"
                                    options={establishment}
                                    getOptionLabel={(option) => i18next.language === "ar" ? (option.nomar) : (option.nomla) }
                                    sx={{ paddingInlineEnd : 1}}
                                    fullWidth
                                    renderInput={(params) => <TextField {...params} label={t("the_etablishment")} inputProps={{...params.inputProps,autoComplete: "disabled"}} />}
                                />
                            ): null}
                            <Autocomplete
                                multiple={true}
                                value={dep!==null ? dep : []}
                                autoHighlight
                                onChange={(e,v) => {setDep(v)}}
                                id="combo-box-demo"
                                options={departments}
                                getOptionLabel={(option) => i18next.language === "ar" ? (option.nomAr) : (option.nomLa) }
                                sx={{ paddingInlineEnd : dep?.length ? 1 : 0 }}
                                fullWidth
                                renderInput={(params) => <TextField {...params} label={t("the_department")} inputProps={{...params.inputProps,autoComplete: "disabled"}} />}
                            />
                            {   dep?.length ? (
                                <Autocomplete
                                    value={depWorkers}
                                    autoHighlight
                                    onChange={(e,v) => setDepWorkers(v)}
                                    id="combo-box-demo"
                                    options={departmentWorkers}
                                    fullWidth
                                    getOptionLabel={(option) => i18next.language === "ar" ? (option.nomar) : (option.nomla) }
                                    renderInput={(params) => <TextField {...params} label={t("departmentWorkers")} inputProps={{...params.inputProps,autoComplete: "disabled"}} />}
                                />
                            ):null}
                        </Box>
                        <TextField sx={{ marginY : 1 , width : 3/12 , paddingRight : 1 }} label={t("correspondance_number")} variant="outlined" name="number" required disabled={isLoading} />
                        <TextField sx={{ marginY : 1 , width : 9/12 }} label={t("subject_message")} variant="outlined" name="title" required disabled={isLoading} />
                        <TextField sx={{ marginY : 1 , width : 6/12 , paddingRight : 1 }} fullWidth multiline rows={2} label={t("references")} variant="outlined" name="references" disabled={isLoading} />
                        <TextField sx={{ marginY : 1 , width : 6/12}} fullWidth multiline rows={2} label={t("concerned")} variant="outlined" name="concerned" disabled={isLoading} />
                        <TextField sx={{ marginY : 1 , width : 8/12 , paddingRight : 1 }} fullWidth label={t("notes")} variant="outlined" rows={4} name="notes" disabled={isLoading} />
                        <TextField sx={{ marginY : 1 , width : 4/12}} error={dateAchevement && new Date(dateAchevement) <= new Date()} onChange={(e)=>setDateAchevement(e.target.value)} id="datetime-local" label={t("achevement_date")} type="date" name="dateachevement" fullWidth InputLabelProps={{ shrink: true,}} disabled={isLoading} />
                        <TextField sx={{ marginY : 1 }} fullWidth multiline label={t("message")} variant="outlined" rows={4} name="message" disabled={isLoading} />
                        <DropFileInput
                            files={files}
                            setFiles={setFiles}
                            multiple={false}
                        />
                        <Box sx={{ display : "flex" , justifyContent:"flex-end" , marginTop : 1}}>
                            { isLoading ? (
                                <LoadingButton 
                                    loading 
                                    variant="contained"
                                >
                                    Submit
                                </LoadingButton>
                            ) : (
                                <Button variant='contained' type="submit" startIcon={<Send />} >
                                    {t("send")}
                                </Button> 
                            )} 
                        </Box>
                    </form> 
                </Paper>
            )}
            
        </React.Fragment>
    );
}
