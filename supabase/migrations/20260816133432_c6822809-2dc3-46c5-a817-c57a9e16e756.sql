CREATE OR REPLACE FUNCTION public.close_trade_position(p_pos_id uuid, p_pnl numeric)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_pos RECORD;
  v_settlement NUMERIC;
BEGIN
  SELECT * INTO v_pos FROM public.positions WHERE id = p_pos_id AND status = 'OPEN';
  IF NOT FOUND THEN RETURN FALSE; END IF;

  IF v_pos.user_id <> auth.uid() AND NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  UPDATE public.positions SET status = 'CLOSED', pnl = p_pnl WHERE id = p_pos_id;
  v_settlement := v_pos.margin + p_pnl;
  UPDATE public.profiles SET futures_balance = futures_balance + v_settlement WHERE id = v_pos.user_id;
  RETURN TRUE;
END;
$$;