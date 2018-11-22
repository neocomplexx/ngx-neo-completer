import { CompleterService } from './services/completer-service';
import { CompleterItem } from './components/completer-item';
import { LocalData } from './services/local-data';
import { Observable } from 'rxjs';

/**
 * Esta clase permite simplificar el uso de los autocompletadores para funcionar con objetos y no con simples string.
 */



export class NgxNeoCompleterService<TEntidad>  {

    public completerService: CompleterService;

    // variable que realiza el binding con el componente html : [(ngModel)]
    public modelString = '';

    // Servicio que se encarga de realizar la busqueda cuando vamos autocompletando : [datasource]
    public dataSource: LocalData;

    // Objeto que tiene la propiedad que queremos hacer binding
    public selectedObject: any;

    // Propiedad sobre la que queremos hacer binding
    public fieldValue = '';

    public empty: TEntidad;

    constructor(completerService: CompleterService) {
        this.completerService = completerService;
    }

    /**
     * Se ejecuta cuando el usuario selecciona un valor del autocompletable
     * @author mgesuitti
     */
    public onSelected(selected: CompleterItem) {
        if (selected != null) {
            this.selectedObject[this.fieldValue] = selected.originalObject;
        } else {
            this.selectedObject[this.fieldValue] = this.empty;


        }
    }

    /**
     * Se utiliza para asignar los datos locales (cargados previamente desde el servidor)
     *
     * @author mgesuitti
     */
    public local(data: any[] | Observable<any>, selectedObject: any, fieldValue: string = '',
        searchFields?: string | null, titleField?: string | null, emptyObject?: TEntidad): LocalData {
        this.selectedObject = selectedObject;
        this.fieldValue = fieldValue;
        this.dataSource = this.completerService.local(data, searchFields, titleField);
        if (fieldValue !== '') {
            this.modelString = this.selectedObject[this.fieldValue][searchFields];
        } else {
            this.modelString = this.selectedObject[searchFields];
        }

        this.empty = emptyObject;

        return this.dataSource;
    }
}
