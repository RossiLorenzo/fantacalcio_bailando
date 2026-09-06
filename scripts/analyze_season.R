#!/usr/bin/env Rscript
# Bailando — highly polished season summary plots.
# Reads <season>/{formazioni,classifica}.csv and emits PNGs in <season>/plots/.
#
# Usage: Rscript scripts/analyze_season.R [season]   # e.g. 2026-2027
# Defaults to the most recent <yyyy>-<yyyy> directory in the repo root.

suppressPackageStartupMessages({
  library(dplyr)
  library(tidyr)
  library(readr)
  library(ggplot2)
  library(stringr)
  library(scales)
  library(ggrepel)
  library(purrr)
  library(forcats)
  library(ragg)
})

# ──────────────────────── paths ────────────────────────
get_script_dir = function() {
  args = commandArgs(trailingOnly = FALSE)
  fa   = sub("--file=", "", grep("--file=", args, value = TRUE))
  if (length(fa) > 0) return(normalizePath(dirname(fa)))
  if (!is.null(sys.frames()) && length(sys.frames()) > 0) {
    of = sys.frame(1)$ofile
    if (!is.null(of)) return(normalizePath(dirname(of)))
  }
  "."
}
script_dir = get_script_dir()
root       = normalizePath(file.path(script_dir, ".."))
season_arg = commandArgs(trailingOnly = TRUE)
season = if (length(season_arg) > 0) {
  season_arg[1]
} else {
  list.dirs(root, recursive = FALSE, full.names = FALSE) |>
    (\(d) d[str_detect(d, "^\\d{4}-\\d{4}$")])() |>
    sort() |>
    tail(1)
}
if (length(season) == 0 || is.na(season)) stop("No <yyyy>-<yyyy> season directory found in ", root)
out_dir    = file.path(root, season)
plots_dir  = file.path(out_dir, "plots")
dir.create(plots_dir, showWarnings = FALSE, recursive = TRUE)

ggsave_polished = function(file, plot, w, h, dpi = 200) {
  ggsave(file.path(plots_dir, file), plot, width = w, height = h, dpi = dpi, device = ragg::agg_png)
}

# ──────────────────────── load ────────────────────────
formazioni = read_csv(file.path(out_dir, "formazioni.csv"), show_col_types = FALSE)
classifica = read_csv(file.path(out_dir, "classifica.csv"), show_col_types = FALSE)

max_g       = max(classifica$giornata)
team_meta   = formazioni |> distinct(team_id, team_name, coach) |> arrange(team_name)

# ColorBrewer Dark2 — 8 colors, all dark enough to be readable on white
team_pal = setNames(
  c("#1B9E77","#D95F02","#7570B3","#E7298A","#66A61E","#B58900","#A6761D","#666666"),
  team_meta$team_name
)

# ──────────────────────── theme ────────────────────────
theme_bailando = function(base = 13) {
  theme_minimal(base_size = base) +
    theme(
      plot.background    = element_rect(fill = "white", color = NA),
      panel.background   = element_rect(fill = "white", color = NA),
      plot.title         = element_text(face = "bold", size = base + 4, color = "grey10", margin = margin(b = 4)),
      plot.subtitle      = element_text(color = "grey35", size = base, margin = margin(b = 14)),
      plot.caption       = element_text(color = "grey50", size = base - 3, hjust = 1, margin = margin(t = 12)),
      plot.title.position = "plot",
      plot.caption.position = "plot",
      plot.margin        = margin(20, 24, 14, 18),
      panel.grid.minor   = element_blank(),
      panel.grid.major.y = element_line(color = "grey92", linewidth = 0.4),
      panel.grid.major.x = element_line(color = "grey92", linewidth = 0.4),
      axis.title         = element_text(color = "grey25", size = base - 1),
      axis.text          = element_text(color = "grey25"),
      axis.ticks         = element_blank(),
      legend.position    = "top",
      legend.title       = element_text(face = "bold"),
      strip.text         = element_text(face = "bold")
    )
}

season_label = str_replace(season, "^(\\d{4})-\\d{2}(\\d{2})$", "\\1-\\2")
caption_str = sprintf("Bailando %s · giornate 1–%d · fonte: appleghe.fantacalcio.it", season_label, max_g)

# ──────────────────────── 1. Rank over season ────────────────────────
last_rank = classifica |>
  filter(giornata == max_g) |>
  arrange(rank_cumulative) |>
  mutate(label_rank = sprintf("%d. %s", rank_cumulative, team_name))

# Background ribbons alternating to make rank levels easier to follow
rank_bg = tibble(rank = 1:nrow(team_meta)) |>
  mutate(fill = if_else(rank %% 2 == 1, "grey97", "white"))

p_rank = classifica |>
  ggplot(aes(giornata, rank_cumulative, color = team_name, group = team_name)) +
    geom_rect(
      data = rank_bg,
      aes(xmin = -Inf, xmax = Inf, ymin = rank - 0.5, ymax = rank + 0.5, fill = fill),
      inherit.aes = FALSE, color = NA, alpha = 0.6
    ) +
    scale_fill_identity() +
    geom_line(linewidth = 1.05, alpha = 0.88) +
    geom_point(size = 1.7, alpha = 0.92) +
    geom_text_repel(
      data = last_rank,
      aes(label = label_rank),
      nudge_x = 1.5, direction = "y", hjust = 0,
      segment.color = "grey75", segment.size = 0.3,
      size = 4.3, fontface = "bold",
      min.segment.length = 0
    ) +
    scale_y_reverse(breaks = 1:nrow(team_meta), expand = expansion(add = 0.4)) +
    scale_x_continuous(breaks = seq(0, max_g, 5), expand = expansion(add = c(0.5, 8))) +
    scale_color_manual(values = team_pal, guide = "none") +
    labs(
      title    = "Posizione in classifica per giornata",
      subtitle = "Chi è stato avanti, chi ha rimontato, chi si è seduto",
      caption  = caption_str,
      x = "Giornata", y = "Posizione in classifica"
    ) +
    theme_bailando() +
    theme(panel.grid.major.y = element_blank())
ggsave_polished("01_rank_over_time.png", p_rank, w = 14, h = 8)

# ──────────────────────── 2. Cumulative points — show DELTA from leader ────────────────────────
leader = classifica |>
  group_by(giornata) |>
  summarise(leader_pts = max(points_cumulative), .groups = "drop")

delta_data = classifica |>
  left_join(leader, by = "giornata") |>
  mutate(delta_from_top = points_cumulative - leader_pts)  # 0 = leader, negative = behind

p_cum = delta_data |>
  ggplot(aes(giornata, delta_from_top, color = team_name, group = team_name)) +
    geom_hline(yintercept = 0, color = "grey50", linewidth = 0.4, linetype = "33") +
    geom_line(linewidth = 1.1, alpha = 0.9) +
    geom_point(size = 1.4, alpha = 0.7) +
    geom_text_repel(
      data        = delta_data |> filter(giornata == max_g),
      aes(label = sprintf("%s  (%.1f)", team_name, delta_from_top)),
      nudge_x     = 1.5, direction = "y", hjust = 0,
      segment.color = "grey75", segment.size = 0.3,
      size        = 4.0, fontface = "bold",
      min.segment.length = 0
    ) +
    scale_color_manual(values = team_pal, guide = "none") +
    scale_x_continuous(breaks = seq(0, max_g, 5), expand = expansion(add = c(0.5, 14))) +
    scale_y_continuous(labels = number_format(accuracy = 1)) +
    labs(
      title    = "Distacco dal primo in classifica",
      subtitle = "0 = la squadra in testa quella giornata. Cifra finale tra parentesi",
      caption  = caption_str,
      x = "Giornata", y = "Punti di distacco dal leader"
    ) +
    theme_bailando()
ggsave_polished("02_cumulative_points.png", p_cum, w = 14, h = 8)

# ──────────────────────── 3. Per-giornata score distribution ────────────────────────
g_medians = classifica |>
  summarise(med = median(points_giornata), .by = c(team_id, team_name)) |>
  arrange(desc(med))

p_dist = classifica |>
  mutate(team_name = factor(team_name, levels = rev(g_medians$team_name))) |>
  ggplot(aes(team_name, points_giornata, fill = team_name)) +
    geom_violin(alpha = 0.42, color = NA, scale = "width") +
    geom_boxplot(width = 0.18, alpha = 0.7, outlier.shape = NA,
                 color = "grey20", linewidth = 0.4) +
    geom_jitter(width = 0.07, alpha = 0.55, size = 1.4, color = "grey15") +
    stat_summary(fun = mean, geom = "point", shape = 23, size = 3,
                 fill = "white", color = "black", stroke = 0.5) +
    scale_fill_manual(values = team_pal, guide = "none") +
    scale_y_continuous(breaks = pretty_breaks(8)) +
    coord_flip() +
    labs(
      title    = "Distribuzione dei punti per giornata",
      subtitle = "Ordinate per mediana · il rombo bianco = media · violino = densità",
      caption  = caption_str,
      x = NULL, y = "Punti per giornata"
    ) +
    theme_bailando() +
    theme(panel.grid.major.y = element_blank())
ggsave_polished("03_score_distribution.png", p_dist, w = 13, h = 8)

# ──────────────────────── 4. Bonus events left on the bench ────────────────────────
bench_evt = formazioni |>
  filter(slot == "Panchina", !actually_used_as_sub) |>
  summarise(
    `Gol`    = sum(goal + pen_goal, na.rm = TRUE),
    `Assist` = sum(assist, na.rm = TRUE),
    .by = c(team_id, team_name)
  ) |>
  pivot_longer(c(Gol, Assist), names_to = "evento", values_to = "totale") |>
  mutate(per_giornata = totale / max_g)

team_order = bench_evt |>
  summarise(s = sum(per_giornata), .by = team_name) |>
  arrange(s) |>
  pull(team_name)

p_bench = bench_evt |>
  mutate(team_name = factor(team_name, levels = team_order),
         evento    = factor(evento, levels = c("Assist", "Gol"))) |>
  ggplot(aes(team_name, per_giornata, fill = evento)) +
    geom_col(position = position_dodge(0.78), width = 0.7) +
    geom_text(aes(label = sprintf("%.2f", per_giornata)),
              position = position_dodge(0.78), hjust = -0.18, size = 3.6, color = "grey25") +
    coord_flip() +
    scale_fill_manual(values = c(Gol = "#D55E00", Assist = "#0072B2")) +
    scale_y_continuous(expand = expansion(mult = c(0, 0.2))) +
    labs(
      title    = "Bonus lasciati in panca — media per giornata",
      subtitle = "Solo panchinari NON entrati come sostituti: i loro bonus sono andati persi davvero",
      caption  = caption_str,
      x = NULL, y = "Eventi per giornata", fill = NULL
    ) +
    theme_bailando()
ggsave_polished("04_bench_left.png", p_bench, w = 12, h = 7)

# ──────────────────────── 5. Top goalscorers ────────────────────────
top_scorers = formazioni |>
  group_by(player_id, player_name, team_name, giornata) |>
  summarise(g = sum(goal + pen_goal, na.rm = TRUE),
            a = sum(assist, na.rm = TRUE),
            .groups = "drop") |>
  summarise(
    goals   = sum(g, na.rm = TRUE),
    assists = sum(a, na.rm = TRUE),
    .by = c(player_id, player_name, team_name)
  ) |>
  filter(goals > 0) |>
  slice_max(goals, n = 15, with_ties = FALSE)

p_scorers = top_scorers |>
  mutate(label = sprintf("%s  (%s)", player_name, team_name)) |>
  ggplot(aes(reorder(label, goals), goals, fill = team_name)) +
    geom_col(width = 0.72) +
    geom_text(aes(label = sprintf("%d gol · %d assist", goals, assists)),
              hjust = -0.07, size = 3.6, color = "grey25") +
    coord_flip() +
    scale_fill_manual(values = team_pal, name = "Squadra fanta") +
    scale_y_continuous(expand = expansion(mult = c(0, 0.28)),
                       breaks = pretty_breaks(6)) +
    labs(
      title    = "Top 15 goleador della stagione",
      subtitle = "Gol + rigori segnati durante l'anno (chiunque schierato o in rosa)",
      caption  = caption_str,
      x = NULL, y = "Gol"
    ) +
    theme_bailando() +
    theme(legend.position = "top")
ggsave_polished("05_top_scorers.png", p_scorers, w = 13, h = 9)

# ──────────────────────── 6. Defense modifier earned ────────────────────────
fix_def = function(v) {
  case_when(
    v == 100 ~ 6,
    v == 56  ~ 6,
    v == 55  ~ 4,
    is.na(v) ~ NA_real_,
    v > 12 | v < 0 ~ 6,
    TRUE ~ v
  )
}

def_per_g = formazioni |>
  filter(slot == "Titolare") |>
  mutate(def_score = fix_def(voto_iniziale)) |>
  group_by(team_id, team_name, giornata) |>
  summarise(
    n_def    = sum(role == "D"),
    top3_def = list(head(sort(def_score[role == "D"], decreasing = TRUE), 3)),
    portiere = first(def_score[role == "P"]),
    .groups  = "drop"
  ) |>
  mutate(
    sum_def_p = map_dbl(top3_def, sum) + coalesce(portiere, 6),
    mod = case_when(
      n_def < 4 ~ 0,
      sum_def_p >= 28 ~ 5,
      sum_def_p >= 26 ~ 3,
      TRUE ~ 1
    )
  )

def_total = def_per_g |>
  summarise(total = sum(mod), n_5 = sum(mod == 5), n_3 = sum(mod == 3),
            n_1 = sum(mod == 1), n_0 = sum(mod == 0),
            .by = c(team_id, team_name)) |>
  pivot_longer(c(n_5, n_3, n_1, n_0), names_to = "level", values_to = "n") |>
  mutate(level = factor(level, levels = c("n_0","n_1","n_3","n_5"),
                        labels = c("0 (no mod)","+1","+3","+5")))

# pre-compute total per team for ordering + annotation
def_team_total = def_per_g |>
  summarise(total = sum(mod), .by = c(team_id, team_name)) |>
  arrange(total)
team_order_def = def_team_total$team_name

p_def = def_total |>
  mutate(team_name = factor(team_name, levels = team_order_def)) |>
  ggplot(aes(team_name, n, fill = level)) +
    geom_col(width = 0.72) +
    geom_text(
      data = def_team_total |>
        mutate(team_name = factor(team_name, levels = team_order_def)),
      aes(team_name, y = max_g + 1, label = sprintf("%d pt", total)),
      inherit.aes = FALSE, hjust = 0, size = 3.8, color = "grey20", fontface = "bold"
    ) +
    coord_flip() +
    scale_fill_manual(
      values = c("0 (no mod)" = "#E5E5E5", "+1" = "#9EC9E2", "+3" = "#4A90C2", "+5" = "#1F4E79"),
      name = "Modificatore"
    ) +
    scale_y_continuous(expand = expansion(mult = c(0, 0.18)), breaks = seq(0, max_g, 5)) +
    labs(
      title    = "Modificatore difesa — quante volte e quanto pesante",
      subtitle = sprintf("Su %d giornate: quante volte ciascuna squadra ha preso 0/+1/+3/+5", max_g),
      caption  = caption_str,
      x = NULL, y = "N° di giornate"
    ) +
    theme_bailando()
ggsave_polished("06_defense_mod.png", p_def, w = 12, h = 7)

# ──────────────────────── 7. Coach efficiency ────────────────────────
appearances = formazioni |>
  filter(slot %in% c("Titolare","Panchina"), player_id != 219) |>
  summarise(first_g = min(giornata), last_g = max(giornata),
            .by = c(team_id, player_id))

in_cal = formazioni |>
  filter(slot == "Fuori_Lista", in_current_rosa) |>
  distinct(team_id, player_id) |>
  mutate(in_cal = TRUE)

tenure = full_join(appearances, in_cal, by = c("team_id", "player_id")) |>
  mutate(
    in_cal = coalesce(in_cal, FALSE),
    min_g  = coalesce(first_g, 1L),
    max_g  = if_else(in_cal, max_g, last_g)
  ) |>
  filter(!is.na(min_g), !is.na(max_g))

fix_eff = function(v) {
  case_when(
    is.na(v) ~ NA_real_,
    v > 12 | v < 0 ~ 6,
    TRUE ~ v
  )
}

player_scores = formazioni |>
  mutate(score_raw = coalesce(live_voto_finale, voto_finale)) |>
  group_by(player_id, giornata) |>
  summarise(
    role      = first(na.omit(role[role %in% c("P","D","C","A")])),
    score_raw = first(na.omit(score_raw)),
    .groups   = "drop"
  ) |>
  mutate(
    score_eff = fix_eff(score_raw),
    score_def = fix_def(score_raw)
  )

available = tenure |>
  rowwise() |>
  mutate(giornate = list(seq(min_g, max_g))) |>
  ungroup() |>
  unnest(giornate) |>
  rename(giornata = giornate) |>
  left_join(player_scores, by = c("player_id", "giornata")) |>
  filter(!is.na(score_eff), !is.na(role))

best_xi_for = function(d) {
  P = d |> filter(role == "P") |> arrange(desc(score_eff))
  if (nrow(P) == 0) return(tibble(best_total = NA_real_, best_schema = NA_character_))
  por_eff = P$score_eff[1]
  por_def = P$score_def[1]
  D = d |> filter(role == "D") |> arrange(desc(score_eff))
  C = d |> filter(role == "C") |> arrange(desc(score_eff))
  A = d |> filter(role == "A") |> arrange(desc(score_eff))

  best_total = -Inf; best_schema = NA_character_
  for (nd in 3:6) for (nc in 3:5) for (na in 1:3) {
    if (nd + nc + na != 10) next
    if (nrow(D) < nd || nrow(C) < nc || nrow(A) < na) next
    base = por_eff +
           sum(D$score_eff[seq_len(nd)]) +
           sum(C$score_eff[seq_len(nc)]) +
           sum(A$score_eff[seq_len(na)])
    mod = if (nd >= 4) {
      top3_def = head(sort(D$score_def[seq_len(nd)], decreasing = TRUE), 3)
      sum_dp = sum(top3_def) + por_def
      if (sum_dp >= 28) 5 else if (sum_dp >= 26) 3 else 1
    } else 0
    tot = base + mod
    if (tot > best_total) { best_total = tot; best_schema = sprintf("1-%d-%d-%d", nd, nc, na) }
  }
  tibble(best_total = best_total, best_schema = best_schema)
}

best_per_g = available |>
  group_by(team_id, giornata) |>
  group_modify(\(d, k) best_xi_for(d)) |>
  ungroup()

actual_per_g = classifica |>
  select(team_id, team_name, coach, giornata, actual_total = points_giornata)

eff = actual_per_g |>
  left_join(best_per_g, by = c("team_id", "giornata")) |>
  mutate(delta = best_total - actual_total) |>
  summarise(
    total_actual = round(sum(actual_total), 1),
    total_best   = round(sum(best_total), 1),
    total_delta  = round(sum(delta), 1),
    avg_delta    = round(mean(delta), 2),
    .by = c(team_id, team_name, coach)
  ) |>
  arrange(total_delta)

cat("\n── Coach efficiency (lower delta = better coach) ──\n")
print(eff)
write_csv(eff, file.path(out_dir, "coach_efficiency.csv"))

best_row  = eff |> slice(1)
worst_row = eff |> slice(nrow(eff))

p_eff = eff |>
  mutate(
    rank   = row_number(),
    label  = sprintf("%s\n(%s)", team_name, coach),
    fillv  = total_delta
  ) |>
  ggplot(aes(reorder(label, -total_delta), total_delta, fill = fillv)) +
    geom_col(width = 0.72) +
    geom_text(aes(label = sprintf("−%.1f", total_delta)),
              hjust = -0.12, size = 4.5, color = "grey15", fontface = "bold") +
    coord_flip() +
    scale_fill_gradient(low = "#27ae60", high = "#c0392b", guide = "none") +
    scale_y_continuous(expand = expansion(mult = c(0, 0.18))) +
    labs(
      title    = "Punti lasciati in tavola — chi è il miglior allenatore?",
      subtitle = sprintf(
        "Differenza fra la miglior formazione possibile (1P + 3-6D + 3-5C + 1-3A) e quella schierata\nMiglior: %s · Peggior: %s · gap fra i due: %.1f pt in 35 giornate",
        best_row$team_name, worst_row$team_name, worst_row$total_delta - best_row$total_delta
      ),
      caption  = caption_str,
      x = NULL, y = "Totale punti persi nella stagione"
    ) +
    theme_bailando()
ggsave_polished("07_coach_efficiency.png", p_eff, w = 13, h = 8)

# ──────────────────────── 8. Coach efficiency trend ────────────────────────
delta_g = actual_per_g |>
  left_join(best_per_g, by = c("team_id", "giornata")) |>
  mutate(delta = best_total - actual_total)

trend_end = delta_g |>
  filter(giornata > max_g - 5) |>
  summarise(giornata = max_g, delta = mean(delta), .by = team_name)

p_eff_g = delta_g |>
  ggplot(aes(giornata, delta, color = team_name)) +
    geom_hline(yintercept = 0, linewidth = 0.4, color = "grey60") +
    geom_smooth(se = FALSE, linewidth = 1.2, method = "loess", span = 0.45) +
    geom_text_repel(
      data = trend_end,
      aes(label = team_name),
      nudge_x = 1.2, direction = "y", hjust = 0,
      segment.color = "grey75", size = 4, fontface = "bold",
      min.segment.length = 0
    ) +
    scale_color_manual(values = team_pal, guide = "none") +
    scale_x_continuous(breaks = seq(0, max_g, 5), expand = expansion(add = c(0.5, 9))) +
    scale_y_continuous(breaks = pretty_breaks(7)) +
    labs(
      title    = "Punti persi per giornata — trend (smoothed)",
      subtitle = "Distanza fra 11 ottimo e 11 schierato, giornata per giornata. Quanto sei stato distratto, in media?",
      caption  = caption_str,
      x = "Giornata", y = "Punti persi (LOESS, span = 0.45)"
    ) +
    theme_bailando()
ggsave_polished("08_coach_efficiency_trend.png", p_eff_g, w = 14, h = 7)

# ──────────────────────── 9. Best XI vs actual XI scatter ────────────────────────
# Per (team, giornata) scatter — diagonal = perfect coach.
p_scatter = actual_per_g |>
  left_join(best_per_g, by = c("team_id", "giornata")) |>
  ggplot(aes(best_total, actual_total, color = team_name)) +
    geom_abline(slope = 1, intercept = 0, color = "grey50", linetype = "33", linewidth = 0.4) +
    geom_point(alpha = 0.75, size = 2.5) +
    scale_color_manual(values = team_pal, name = NULL) +
    coord_equal() +
    labs(
      title    = "Schierato vs ottimo — ogni punto = una giornata",
      subtitle = "Linea tratteggiata = formazione perfetta. Più sotto, più sei stato distratto.",
      caption  = caption_str,
      x = "Miglior 11 possibile (punti)",
      y = "11 effettivamente schierato (punti)"
    ) +
    theme_bailando() +
    theme(legend.position = "right")
ggsave_polished("09_actual_vs_optimal.png", p_scatter, w = 11, h = 9)

cat(sprintf("\n✓ Saved %d plots to %s/\n",
            length(list.files(plots_dir, pattern = "\\.png$")), plots_dir))
