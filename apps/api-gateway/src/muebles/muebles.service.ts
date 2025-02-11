import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateMuebleDto, UpdateMuebleDto, MUEBLES_PATTERNS, PaginationDto } from '@app/contracts';
import { MUEBLES_CLIENT } from './constant'
import { catchError, firstValueFrom } from 'rxjs';


@Injectable()
export class MueblesService {
    constructor(@Inject(MUEBLES_CLIENT) private mueblesClient: ClientProxy) {}


    findAllMueble(){
        return this.mueblesClient.send(MUEBLES_PATTERNS.FIND_ALL, {})
    }

    findAllPaginado(paginationDto: PaginationDto){
        return this.mueblesClient.send(MUEBLES_PATTERNS.FIND_PAGINADO, paginationDto)
    }

    findMuebleById(id: number){
        return this.mueblesClient.send(MUEBLES_PATTERNS.FIND_ONE, { id })
        .pipe(
            catchError( err => { throw new RpcException(err) } )
        );
    }

    createMueble(createMuebleDto: CreateMuebleDto){
        return this.mueblesClient.send(MUEBLES_PATTERNS.CREATE_MUEBLE, createMuebleDto)
    }

    updateMueble(updateMuebleDto: UpdateMuebleDto){
        return this.mueblesClient.send(MUEBLES_PATTERNS.UPDATE_MUEBLE, updateMuebleDto)
        .pipe(
            catchError( err => { throw new RpcException(err) } )
        );
    }

    /* async changeStatus(id:number){
        try{
            const mueble = await firstValueFrom(
                this.mueblesClient.send(MUEBLES_PATTERNS.CHANGE_STATUS, { id })
            );
            return mueble;
        }catch ( error ){
            throw new RpcException(error)
        }
    } */

    changeStatus(id:number){
        return this.mueblesClient.send(MUEBLES_PATTERNS.CHANGE_STATUS, { id })
        .pipe(
            catchError( err => { throw new RpcException(err) } )
        );
    }

    deleteMueble(id:number){
        return this.mueblesClient.send(MUEBLES_PATTERNS.DELETE_MUEBLE, { id })
        .pipe(
            catchError( err => { throw new RpcException(err) } )
        );
    }

}
