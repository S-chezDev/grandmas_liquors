import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:grandmas_liquors_movil/data/repositories/sales_management_repository.dart';
import 'package:grandmas_liquors_movil/presentation/providers/auth_provider.dart';

final salesManagementRepositoryProvider = Provider<SalesManagementRepository>((
  ref,
) {
  final api = ref.watch(apiServiceProvider);
  return SalesManagementRepository(api);
});
