import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { AuditService } from '../../modules/audit/audit.service';
import { AUDIT_ACTION_KEY } from '../decorators/audit.decorator';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private auditService: AuditService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const auditMeta = this.reflector.get<{ action: string; entityType?: string }>(
      AUDIT_ACTION_KEY,
      context.getHandler(),
    );
    if (!auditMeta?.action) return next.handle();

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const entityId =
          request.params?.id ||
          request.body?.id ||
          request.params?.clientId ||
          request.params?.saleId;

        this.auditService.log({
          action: auditMeta.action,
          entityType: auditMeta.entityType || request.route?.path || 'unknown',
          entityId,
          userId: user?.id,
          details: { method: request.method, path: request.route?.path },
          outcome: 'SUCCESS',
          duration: Date.now() - startTime,
        });
      }),
      catchError((error) => {
        const entityId =
          request.params?.id ||
          request.body?.id ||
          request.params?.clientId ||
          request.params?.saleId;

        this.auditService.log({
          action: auditMeta.action,
          entityType: auditMeta.entityType || request.route?.path || 'unknown',
          entityId,
          userId: user?.id,
          details: { method: request.method, path: request.route?.path, error: error.message },
          outcome: 'FAILURE',
          duration: Date.now() - startTime,
        });
        return throwError(() => error);
      }),
    );
  }
}
